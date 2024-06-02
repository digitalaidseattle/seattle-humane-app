/**
 *  ClientService.test.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AppConstants } from 'src/constants';
import type { AppConstantType } from '@types';
import { mockAnimal, mockClient, mockTicket } from '@hooks/__mocks__/useTicketById';
import { recentTickets } from '@hooks/__mocks__/useRecentTickets';
import ClientService, { clientService } from '../../../src/services/ClientService';
import supabaseClient from '../../../utils/supabaseClient';

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
const mockSupabaseClient = jest.mocked(supabaseClient as typeof supabaseClient & {
  setTestData(newData): void
  setTestError(errorText): void
});

jest.spyOn(global.console, 'log').mockImplementation(() => { });

afterEach(() => {
  // Reset the call counts for mocks
  jest.clearAllMocks();
  // Reset db test data and errors
  mockSupabaseClient.setTestData([]);
  mockSupabaseClient.setTestError(null);
});

describe('ClientService', () => {
  describe('createClient()', () => {
    it('should throw error if client information is missing', async () => {
      // arrange
      mockSupabaseClient.setTestData(null);
      // act & assert
      await expect(ClientService.createClient(null))
        .rejects.toThrow();
    });
    it('should save the client to the DB', async () => {
      //* Arrange
      mockSupabaseClient.setTestData(mockClient);

      //* Act
      const mockClientInput = { ...mockClient };
      delete mockClientInput.id;
      const actual = await ClientService.createClient(mockClientInput);

      //* Assert
      expect(mockSupabaseClient.from('clients').insert)
        .toHaveBeenCalledWith(expect.arrayContaining(
          [expect.objectContaining(mockClientInput)],
        ));
      expect(actual).toBe(mockClient);
    });
  });
  describe('createAnimal()', () => {
    it('should throw error if animal information is missing', async () => {
      // arrange
      mockSupabaseClient.setTestData(null);
      // act & assert
      await expect(ClientService.createAnimal(null, ''))
        .rejects.toThrow();
    });
    it('should save the animal to the DB', async () => {
      //* Arrange
      mockSupabaseClient.setTestData(mockAnimal);

      //* Act
      const mockAnimalInput = { ...mockAnimal };
      delete mockAnimalInput.id;
      const actual = await ClientService.createAnimal(mockAnimalInput, mockClient.id);

      //* Assert
      expect(mockSupabaseClient.from('pets').insert)
        .toHaveBeenCalledWith(expect.arrayContaining(
          [expect.objectContaining(mockAnimalInput)],
        ));
      expect(actual).toBe(mockAnimal);
    });
  });
  describe('createTicket()', () => {
    it('should throw error if ticket information is missing', async () => {
      // arrange
      mockSupabaseClient.setTestData(null);
      // act & assert
      await expect(ClientService.createTicket(null, '', ''))
        .rejects.toThrow();
    });
    it('should save the ticket to the DB', async () => {
      //* Arrange
      mockSupabaseClient.setTestData(mockTicket);

      //* Act
      const mockTicketlInput = { ...mockTicket };
      delete mockTicketlInput.id;
      delete mockTicketlInput.log_id;
      delete mockTicketlInput.created_at;
      const actual = await ClientService
        .createTicket(mockTicketlInput, mockClient.id, mockAnimal.id);

      //* Assert
      expect(mockSupabaseClient.from('service_requests').insert)
        .toHaveBeenCalledWith(expect.arrayContaining(
          [expect.objectContaining(mockTicketlInput)],
        ));
      expect(actual).toBe(mockTicket);
    });
  });
  describe('static getTicket()', () => {
    it('returns the ticket from the db', async () => {
      // Arrange
      const expectedTicket = mockTicket;
      mockSupabaseClient.setTestData(expectedTicket);
      // Act
      const actualTicket = await ClientService.getTicket(expectedTicket.id);
      // Assert
      expect(actualTicket).toBe(expectedTicket);
    });
    it('throws errors from the db', async () => {
      // Arrange
      const expectedErrorMessage = 'Internal DB Error';
      mockSupabaseClient.setTestError(new Error(expectedErrorMessage));
      // Act & Assert
      await expect(ClientService.getTicket('')).rejects.toThrow(expectedErrorMessage);
    });
  });
  describe('static getRecentTickets()', () => {
    it('returns recent tickets from the db', async () => {
      // Arrange
      const expectedTickets = recentTickets;
      mockSupabaseClient.setTestData(expectedTickets);
      // Act
      const actualTicket = await ClientService.getRecentTickets();
      // Assert
      expect(actualTicket).toBe(expectedTickets);
    });
    it('throws errors from the db', async () => {
      // Arrange
      const expectedErrorMessage = 'Internal DB Error';
      mockSupabaseClient.setTestError(new Error(expectedErrorMessage));
      // Act & Assert
      await expect(ClientService.getRecentTickets()).rejects.toThrow(expectedErrorMessage);
    });
  });
  it.each([
    // [label suffix for test, AppConstant type, ClientService method name]
    ['service categories', AppConstants.Category, 'getServiceCategories'],
    ['service statuses', AppConstants.Status, 'getServiceStatuses'],
  ])('should get %s', async (label, appConstantType, methodName: 'getServiceCategories' | 'getServiceStatuses') => {
    // Arrange
    const expectedAppConstants: AppConstantType[] = [{ test: 1 }] as any;
    mockSupabaseClient.setTestData(expectedAppConstants);

    // Act
    const returnedAppConstants = await clientService[methodName]();

    // Assert
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('app_constants');
    expect(mockSupabaseClient.from('app_constants').select).toHaveBeenCalledWith('*');
    expect(mockSupabaseClient.from('app_constants').select('').eq).toHaveBeenCalledWith('type', appConstantType);
    /**
     * 'toBe' checks for reference equality to ensure
     * getServiceCategories function returns the exact
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
      const actual = await clientService.getTeamMembers();

      //* Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('team_members');
      expect(mockSupabaseClient.from).toHaveBeenCalledTimes(1);
      expect(mockSupabaseClient.from('team_members').select).toHaveBeenCalledTimes(1);
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
      await expect(clientService.getTeamMembers()).rejects.toThrow(error.message);
    });
  });
});
