/**
 *  ClientService.test.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { ServiceCategory, clientService, upsertClient } from '../../../src/services/ClientService';
// FIXME this should be mocked! We might need dependency injection
// It doesn't seem that this is connecting to the database but I'm not sure...
import supabaseClient from '../../../utils/supabaseClient';
import { ClientType, RequestType as ServiceRequestType, AnimalType } from '../../../src/types';

describe('ClientService', () => {
  it('should get service categories', async () => {
    const response = { data: [new ServiceCategory({})], error: null };
    const mockQueryBuilder = {
      select: jest.fn(() => Promise.resolve(response)),
    };
    const fromSpy = jest.spyOn(supabaseClient, 'from')
      .mockReturnValue(mockQueryBuilder as any);
    const selectSpy = jest.spyOn(mockQueryBuilder, 'select')
      .mockReturnValue(response as any);

    const cats = await clientService.getServiceCategories();
    expect(fromSpy).toHaveBeenCalledWith('service_category');
    expect(selectSpy).toHaveBeenCalledWith('*');
    expect(cats.length).toEqual(1);
  });

  it('should get service statuses', async () => {
    const stats = await clientService.getServiceStatuses();
    expect(stats.length).toBeGreaterThan(1);
  });

  it('should be able to upsert new client', async () => {
    const client: ClientType = {
      email: 'fake_email@example.com',
      first_name: 'test_first',
      last_name: 'test_last',
      phone: '5555555555',
      postal_code: '',
      previously_used: '',
    };

    const clientTableResponse = { data: client, error: null };
    const mockClientQueryBuilder = {
      upsert: jest.fn(() => Promise.resolve(clientTableResponse)),
    };
    const fromClientSpy = jest.spyOn(supabaseClient, 'from')
      .mockReturnValue(mockClientQueryBuilder as any);
    const upsertClientSpy = jest.spyOn(mockClientQueryBuilder, 'upsert')
      .mockReturnValue(clientTableResponse as any);

    const upsertResponse = await upsertClient(client);

    expect(fromClientSpy).toHaveBeenCalledWith('clients');
    expect(upsertClientSpy).toHaveBeenCalledWith(client, { onConflict: 'email' });
    expect(upsertResponse.email).toEqual('fake_email@example.com');
  });

  it('should be able to create a request with a new client', async () => {
    // I am testing to make sure a service request is created
    // I don't need to test all the private functions, just the
    // overall system

    // Mock the upsert call for the client table
    // Mock the insert call for the pet table
    // Mock the insert call for the request

    // make service call

    // expect the new service request to have been created with the correct data
  });
});
