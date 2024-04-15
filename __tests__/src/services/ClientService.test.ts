/**
 *  ClientService.test.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { clientService } from '../../../src/services/ClientService';
import supabaseClient from '../../../utils/supabaseClient';

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

})