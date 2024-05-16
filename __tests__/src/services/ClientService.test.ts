/**
 *  ClientService.test.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AppConstants } from 'src/constants';
import { AppConstantType } from '@types';
import { clientService } from '../../../src/services/ClientService';
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
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
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

afterEach(() => {
  // Reset the call counts for mocks
  jest.clearAllMocks();
  // Reset db test data and errors
  mockSupabaseClient.setTestData([]);
  mockSupabaseClient.setTestError(null);
});

describe('ClientService', () => {
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
