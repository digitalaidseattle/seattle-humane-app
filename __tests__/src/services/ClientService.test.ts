/**
 *  ClientService.test.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { ServiceCategory } from '@lib';
import ClientService, {
  clientService,
} from '@services/ClientService';
// FIXME this should be mocked! We might need dependency injection
// It doesn't seem that this is connecting to the database but I'm not sure...
import {
  ServiceRequestSchemaInsert, ClientSchemaInsert,
  AnimalSchemaInsert,
} from '@types';
import { clearPrerequisiteTestData, setupPrerequisiteTestData, testData } from '__tests__/src/services/testSetup';
import { testAnimalInput } from '__tests__/src/services/testData';
import supabaseClient from '../../../utils/supabaseClient';

describe('ClientService', () => {
  beforeEach(async () => setupPrerequisiteTestData());
  afterEach(async () => clearPrerequisiteTestData());

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
    const client: ClientSchemaInsert = {
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

    const upsertResponse = await ClientService.upsertClient(client);

    expect(fromClientSpy).toHaveBeenCalledWith('clients');
    expect(upsertClientSpy).toHaveBeenCalledWith(client, { onConflict: 'email' });
    expect(upsertResponse.email).toEqual('fake_email@example.com');
  });

  it('should be able to insert a new pet', async () => {
    const pet: AnimalSchemaInsert = {
      name: 'Spike',
      species_id: testData.species[0].id,
      weight: 2,
      age: 15,
    };

    const petTableResponse = { data: pet, error: null };
    const mockPetQueryBuilder = {
      insert: jest.fn(() => Promise.resolve(petTableResponse)),
    };
    const fromPetSpy = jest.spyOn(supabaseClient, 'from')
      .mockReturnValue(mockPetQueryBuilder as any);
    const insertPetSpy = jest.spyOn(mockPetQueryBuilder, 'insert')
      .mockReturnValue(petTableResponse as any);

    const insertResponse = await ClientService.insertPet(pet, testData.species[0].id);

    expect(fromPetSpy).toHaveBeenCalledWith('pets');
    expect(insertPetSpy).toHaveBeenCalledWith(pet);
    expect(insertResponse.name).toEqual('Spike');
  });

  it('should be able to insert a request', async () => {
    const { data: pet } = await supabaseClient
      .from('pets').insert(testAnimalInput)
      .select().maybeSingle();
    const request: ServiceRequestSchemaInsert = {
      pet_id: pet.id,
      service_category_id: testData.categories[0].id,
      request_source_id: testData.sources[0].id,
      description: 'Dragon hurt wing in chase with Harry Potter',
      team_member_id: testData.teamMembers[0].id,
    };

    const requestTableResponse = { data: request, error: null };
    const mockRequestQueryBuilder = {
      insert: jest.fn(() => Promise.resolve(requestTableResponse)),
    };
    const fromRequestSpy = jest.spyOn(supabaseClient, 'from')
      .mockReturnValue(mockRequestQueryBuilder as any);
    const insertRequestSpy = jest.spyOn(mockRequestQueryBuilder, 'insert')
      .mockReturnValue(requestTableResponse as any);

    const insertResponse = await ClientService.insertRequest(request);

    expect(fromRequestSpy).toHaveBeenCalledWith('requests');
    expect(insertRequestSpy).toHaveBeenCalledWith(request);
    expect(insertResponse.animal_id).toEqual(new Uint8Array(12345));
  });
});
