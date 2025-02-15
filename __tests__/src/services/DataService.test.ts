/* eslint-disable @typescript-eslint/naming-convention */
/**
 *  DataService.test.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AppConstants } from 'src/constants';
import {
  AppConstantType,
  EditablePetType,
  EditableClientType,
  EditableServiceRequestType,
} from '@types';
import * as DataService from '@services/DataService';
import supabaseClient from '@utils/supabaseClient';
import {
  mockClient,
  mockPet,
  mockTicket,
  mockTickets,
  mockTicketsThisWeek,
  mockTeamMember1,
} from '@utils/TestData';
import { getWeekStartDate } from '@utils/timeUtils';

// Idea for mock from https://stackoverflow.com/questions/77411385/how-to-mock-supabase-api-select-requests-in-nodejs
jest.mock('@supabase/supabase-js', () => ({
  /** Need to use non-arrow function to bind setTestData function to returned 'supabaseClient' object  */
  // eslint-disable-next-line prefer-arrow-callback
  createClient: jest.fn().mockImplementation(function mockCreateClient() {
    return {
      setTestData(newData) {
        this.data = newData;
      },
      setTestError(errorText) {
        this.error = errorText;
      },
      data: [],
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      error: null,
    };
  }),
}));

/**
 * The above module mock for supabase has two extra functions
 * that we use for testing purposes.
 * However Jest infers the type based on the original module.
 * So we need to manually cast the type to match our mock.
 */
const mockSupabaseClient = jest.mocked(
  supabaseClient as typeof supabaseClient & {
    setTestData(newData): void;
    setTestError(errorText): void;
  }
);

jest.spyOn(global.console, 'log').mockImplementation(() => {});

afterEach(() => {
  // Reset the call counts for mocks
  jest.clearAllMocks();
  // Reset db test data and errors
  mockSupabaseClient.setTestData([]);
  mockSupabaseClient.setTestError(null);
});

describe('DataService', () => {
  describe('createClient()', () => {
    const ticket = {} as EditableServiceRequestType;
    const client = {} as EditableClientType;
    const animal = {} as EditablePetType;

    it('should throw error if client information is missing', async () => {
      // arrange
      mockSupabaseClient.setTestData(null);
      // act & assert
      await expect(DataService.createClient(client)).rejects.toThrow();
    });
    it('should throw error if animal information is missing', async () => {
      // arrange
      mockSupabaseClient.setTestData(null);
      // act & assert
      await expect(DataService.createAnimal(animal, '')).rejects.toThrow();
    });
    it('should throw error if ticket information is missing', async () => {
      // arrange
      mockSupabaseClient.setTestData(null);
      // act & assert
      await expect(DataService.createTicket(ticket, '', '')).rejects.toThrow();
    });
  });
  describe('static getTicket()', () => {
    it('returns the ticket from the db', async () => {
      // Arrange
      const expectedTicket = mockTicket;
      mockSupabaseClient.setTestData(expectedTicket);
      // Act
      const actualTicket = await DataService.getTicket(expectedTicket.id);
      // Assert
      expect(actualTicket).toBe(expectedTicket);
    });
    it('throws errors from the db', async () => {
      // Arrange
      const expectedErrorMessage = 'Internal DB Error';
      mockSupabaseClient.setTestError(new Error(expectedErrorMessage));
      // Act & Assert
      await expect(DataService.getTicket('')).rejects.toThrow(
        expectedErrorMessage
      );
    });
  });
  describe('static getServiceRequestSummary()', () => {
    it('returns recent tickets from the db', async () => {
      // Arrange
      const expectedTickets = mockTickets;
      /**
       * TODO research a better way to mock consecutive queries to supabase client
       * here the first query simply returns all the data used in subsequent queries
       * so this test is tightly coupled with the implementation.
       * Would be better to somehow do mockSupabaseClient.mockDataOnce(...)
       * or mockSupabaseClient.mockQueryOnce(...)
       */
      // add clients, pets, teammebers and the app constant label to the mock tickets
      const expectedQueryResults = expectedTickets.map((ticket) => ({
        ...ticket,
        clients: {
          first_name: mockClient.first_name,
          last_name: mockClient.last_name,
        },
        pets: {
          name: mockPet.name,
          species: ticket.id,
        },
        team_members: {
          first_name: mockTeamMember1.first_name,
          last_name: mockTeamMember1.last_name,
          email: mockTeamMember1.email,
        },
        service_category: ticket.id,
        label: 'mock app constant label',
      }));
      mockSupabaseClient.setTestData(expectedQueryResults);
      const expectedServiceRequestSummary = expectedQueryResults.map((data) => {
        const { clients, pets, team_members, id, label, ...ticket } = data;
        return {
          id,
          client: {
            first_name: clients.first_name,
            last_name: clients.last_name,
          },
          pet: {
            name: pets.name,
            species: label,
          },
          team_member: {
            first_name: team_members.first_name,
            last_name: team_members.last_name,
            email: team_members.email,
          },
          service_category: label,
          created_at: ticket.created_at,
          description: ticket.description,
          urgent: ticket.urgent,
          status: ticket.status,
          modified_at: ticket.modified_at,
        };
      });
      // Act
      const actualTicket = await DataService.getServiceRequestSummary();
      // Assert
      expect(actualTicket).toEqual(expectedServiceRequestSummary);
    });
    it('throws errors from the db', async () => {
      // Arrange
      const expectedErrorMessage = 'Internal DB Error';
      mockSupabaseClient.setTestError(new Error(expectedErrorMessage));
      // Act & Assert
      await expect(DataService.getServiceRequestSummary()).rejects.toThrow(
        expectedErrorMessage
      );
    });
  });
  it.each([
    // [label suffix for test, AppConstant type, DataService method name]
    ['service categories', AppConstants.Category],
    ['service statuses', AppConstants.Status],
  ])('should get %s', async (label, appConstantType) => {
    // Arrange
    const expectedAppConstants: AppConstantType[] = [{ test: 1 }] as any;
    mockSupabaseClient.setTestData(expectedAppConstants);

    // Act
    const returnedAppConstants = await DataService.getAppConstants(
      appConstantType
    );

    // Assert
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('app_constants');
    expect(
      mockSupabaseClient.from('app_constants').select
    ).toHaveBeenCalledWith('*');
    expect(
      mockSupabaseClient.from('app_constants').select('').eq
    ).toHaveBeenCalledWith('type', appConstantType);
    /**
     * 'toBe' checks for reference equality to ensure
     * getAppConstants function returns the exact
     * array instance that the query returns
     */
    expect(returnedAppConstants).toBe(expectedAppConstants);
  });
  describe('getTeamMembers', () => {
    it('should get team members', async () => {
      //* Arrange
      const expected = [];
      mockSupabaseClient.setTestData(expected);

      //* Act
      const actual = await DataService.getTeamMembers();

      //* Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('team_members');
      expect(mockSupabaseClient.from).toHaveBeenCalledTimes(1);
      expect(
        mockSupabaseClient.from('team_members').select
      ).toHaveBeenCalledTimes(1);
      /**
       * getTeamMembers isn't concerned with the shape of the data
       * returned by the database. So we only check that the function returns
       * whatever was returned from the db query.
       * Using '.toBe' performs an equality check by reference,
       * ensuring that the array instance set as the test data
       * is the same instance returned by getTeamMembers.
       */
      expect(actual).toBe(expected);
    });
    it('should throw errors returned from supabase', async () => {
      //* Arrange
      const error = { message: 'Random DB Error' };
      mockSupabaseClient.setTestError(error);

      //* Act & Assert
      await expect(DataService.getTeamMembers()).rejects.toThrow(error.message);
    });
  });
  describe('getTicketsThisWeek', () => {
    it("should get this week's tickets", async () => {
      // Arrange
      const expected = mockTicketsThisWeek;
      mockSupabaseClient.setTestData(expected);
      const weekStartDate = getWeekStartDate().toISOString(); // Sunday, 21 July 2024

      // Act
      const actualTickets = await DataService.getTicketsThisWeek();

      // Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('service_requests');
      expect(mockSupabaseClient.from).toHaveBeenCalledTimes(1);
      expect(
        mockSupabaseClient.from('service_requests').select
      ).toHaveBeenCalledTimes(1);
      expect(
        mockSupabaseClient.from('service_requests').select().gte
      ).toHaveBeenCalledWith('created_at', weekStartDate);
      /**
       * we aren't checking for shape of data returned by getTicketsThisWeek, just need to know it can filter based on created_at column
       */
      expect(actualTickets.length).toBe(expected.length);
    });
    it('should throw errors returned from supabase', async () => {
      // Arrange
      const error = { message: 'Random DB Error' };
      mockSupabaseClient.setTestError(error);

      // Act & Assert
      await expect(DataService.getTicketsThisWeek()).rejects.toThrow(
        error.message
      );
    });
  });
});
