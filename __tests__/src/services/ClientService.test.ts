/**
 *  ClientService.test.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */

import { Statuses } from '@lib';
import ClientService, {
  clientService,
} from '@services/ClientService';
// FIXME this should be mocked! We might need dependency injection
// It doesn't seem that this is connecting to the database but I'm not sure...
import {
  ClientSchemaInsert,
  AnimalSchemaInsert,
} from '@types';
import { clearTables, setupPrerequisiteTestData, testData } from 'utils/testSetup';
import { testAnimalInput, testClientInput } from 'utils/testUserInput';
import supabaseClient from '../../../utils/supabaseClient';

describe('ClientService', () => {
  beforeAll(async () => {
    await setupPrerequisiteTestData();
  });
  afterAll(async () => {
    jest.restoreAllMocks();
    await clearTables();
  });

  it('should get service categories', async () => {
    const categories = await clientService.getServiceCategories();
    expect(testData.categories.length).toBeGreaterThan(0);
    expect(categories.length).toEqual(testData.categories.length);
  });

  it('should get service statuses', async () => {
    const stats = await clientService.getServiceStatuses();
    expect(Statuses.length).toBeGreaterThan(0);
    expect(stats.length).toEqual(Statuses.length);
  });

  it('should upsert a client', async () => {
    const client: ClientSchemaInsert = {
      email: 'fake_email@example.com',
      first_name: 'test_first',
      last_name: 'test_last',
      phone: '5555555555',
      postal_code: '',
      previously_used: '',
    };

    const returnedClient = await ClientService.upsertClient(client);
    const { data: savedClient } = await supabaseClient
      .from('clients')
      .select().eq('email', client.email).maybeSingle();
    expect(returnedClient).toEqual(savedClient);
  });

  it('should insert a pet', async () => {
    const { species } = testData;
    const pet: AnimalSchemaInsert = {
      name: 'Spike',
      species_id: species[0].id,
      weight: 2,
      age: 15,
    };

    const returnedPet = await ClientService.insertPet(pet, species[0].id);
    const { data: savedPet } = await supabaseClient
      .from('pets').select()
      .eq('name', pet.name).maybeSingle();
    expect(returnedPet).toEqual(savedPet);
  });

  it('should be able to insert a request', async () => {
    const { species } = testData;
    const { data: client } = await supabaseClient
      .from('clients').insert(testClientInput).select().maybeSingle();
    const { data: pet } = await supabaseClient
      .from('pets').insert({
        ...testAnimalInput,
        species_id: species[0].id,
      }).select().maybeSingle();
    const description = 'New request';
    const requestInput = {
      description,
      client_id: client.id,
      pet_id: pet.id,
      service_category_id: testData.categories[0].id,
      request_source_id: testData.sources[0].id,
      team_member_id: testData.teamMembers[0].id,
    };
    const returnedRequest = await ClientService.insertRequest(requestInput);
    const { data: savedRequest } = await supabaseClient
      .from('service_requests').select().eq('description', description).maybeSingle();
    expect(returnedRequest).toEqual(savedRequest);
  });
});
