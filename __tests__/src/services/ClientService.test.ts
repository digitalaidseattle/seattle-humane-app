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


// TODO put these in an ObjectMother
const mockFilterBuilder = {
  limit: jest.fn(() => Promise.resolve({})),
  range: jest.fn(() => Promise.resolve({})),
  order: jest.fn(() => Promise.resolve({}))
};

const mockQueryBuilder = {
  insert: jest.fn(() => Promise.resolve({})),
  update: jest.fn(() => Promise.resolve({})),
  select: jest.fn(() => Promise.resolve({})),
  eq: jest.fn(() => Promise.resolve({}))
};

describe('ClientService', () => {
  it.each([
    // [label suffix for test, AppConstant type, ClientService method name]
    ['service categories', AppConstants.Category, 'getServiceCategories'],
    ['service statuses', AppConstants.Status, 'getServiceStatuses'],
  ])('should get %s', async (label, appConstantType, methodName: 'getServiceCategories' | 'getServiceStatuses') => {
    // Arrange
    const expectedAppConstants: AppConstantType[] = [{ test: 1 }] as any;
    (supabaseClient as typeof supabaseClient & { setTestData(newData): void })
      .setTestData(expectedAppConstants);
    const mockSupabaseClient = jest.mocked(supabaseClient);

    // Act
    const returnedAppConstants = await clientService[methodName]();

    // Assert
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('app_constants');
    expect(mockSupabaseClient.from('').select).toHaveBeenCalledWith('*');
    expect(mockSupabaseClient.from('').select('').eq).toHaveBeenCalledWith('type', appConstantType);
    /**
     * 'toBe' checks for reference equality to ensure
     * getServiceCategories function returns the exact
     * array instance that the query returns
     */
    expect(returnedAppConstants).toBe(expectedAppConstants);
  });
});


it('getServiceRequests', async () => {
  const searchOptions = {
    first: 0,
    page: 0,
    pageCount: 0,
    rows: 10,
  }

  const serviceRequests = [{}];
  const response = { data: serviceRequests }

  const fromSpy = jest.spyOn(supabaseClient, 'from')
    .mockReturnValue(mockQueryBuilder as any)
  const selectSpy = jest.spyOn(mockQueryBuilder, 'select')
    .mockReturnValue(mockFilterBuilder as any)
  const rangeSpy = jest.spyOn(mockFilterBuilder, 'range')
    .mockResolvedValue(response)

  const actual = await clientService.getServiceRequests(searchOptions);
  expect(fromSpy).toHaveBeenCalledWith('service_requests');
  expect(selectSpy).toHaveBeenCalledWith('*, team_members(*)');
  expect(rangeSpy).toHaveBeenCalledWith(0, 10);
  expect(actual).toEqual(serviceRequests);
});

it('getServiceRequestsTotalRecords', async () => {
  const response = { count: 14 }

  const fromSpy = jest.spyOn(supabaseClient, 'from')
    .mockReturnValue(mockQueryBuilder as any)
  const selectSpy = jest.spyOn(mockQueryBuilder, 'select')
    .mockResolvedValue(response)

  const actual = await clientService.getServiceRequestsTotalRecords();
  expect(fromSpy).toHaveBeenCalledWith('service_requests');
  expect(selectSpy).toHaveBeenCalledWith('*, team_members(*)');
  expect(actual).toEqual(14);
});