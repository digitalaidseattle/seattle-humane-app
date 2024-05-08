/**
 *  ClientService.test.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { AppConstantType } from '@types';
import { AppConstants } from 'src/constants';
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

describe('ClientService', () => {
  it('should get appConstants by type', async () => {
    // Arrange
    const expectedAppConstants: AppConstantType[] = [{ test: 1 }] as any;
    (supabaseClient as typeof supabaseClient & { setTestData(newData): void })
      .setTestData(expectedAppConstants);
    const mockSupabaseClient = jest.mocked(supabaseClient);
    const mockAppConstantType = 'mockType' as AppConstants;
    // Act
    const returnedAppConstants = await clientService.getAppConstants(mockAppConstantType);

    // Assert
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('app_constants');
    expect(mockSupabaseClient.from('').select).toHaveBeenCalledWith('*');
    expect(mockSupabaseClient.from('').select('').eq).toHaveBeenCalledWith('type', mockAppConstantType);
    /**
     * 'toBe' checks for reference equality to ensure
     * getServiceCategories function returns the exact
     * array instance that the query returns
     */
    expect(returnedAppConstants).toBe(expectedAppConstants);
  });
});
