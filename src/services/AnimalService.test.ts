import { Animal, AppConstant, Client } from '@types';
import { AppConstants } from 'src/constants';
import { AnimalService } from 'src/services/AnimalService';
import { ClientService } from 'src/services/ClientService';
import supabaseClient from 'utils/supabaseClient';
import { v4 as createUUID } from 'uuid';

const testClient: Omit<Client, 'id'> = {
  email: 'sh-test@digitalseattle.org',
  first_name: 'John',
  last_name: 'Smith',
  phone: '5555555555',
  postal_code: '55555',
  previously_used: 'false',
};
const testSpecies: Pick<AppConstant, 'type' | 'label' | 'value'> = {
  type: AppConstants.Species,
  label: 'Dog',
  value: 'dog',
};
const testAnimal: Omit<Animal, 'id' | 'client_id'> = {
  age: 5,
  name: 'Sparky',
  species_id: createUUID(),
  weight: 15,
};
// These tests require the database to be running locally
// Run `npx supabase start` and set the needed vars your .env.test
// i.e. the URI with the anon_key
describe('AnimalService', () => {
  /**
   * Clean up data before tests run, as its possible old test data remains
   * from previous run
   */
  beforeEach(async () => {
    await supabaseClient.from('clients').delete().eq('email', testClient.email);
  });
  /**
   * Clean up data after tests run to keep tests independent
   */
  afterEach(async () => {
    await supabaseClient.from('clients').delete().eq('email', testClient.email);
  });

  // helpers for commonly used functions
  const createTestClient = () => ClientService.createClient(testClient);
  const createTestSpecies = () => AnimalService.createSpecies(testSpecies);

  const createTestAnimalForClient = (client_id: string) => AnimalService
    .createAnimal(testAnimal, client_id);

  it('creates new species', async () => {
    const species = await createTestSpecies();
    expect(species.id).not.toBeFalsy();
  });
  it('finds species by id', async () => {
    await createTestSpecies();
    const species = await AnimalService.findSpecies(testClient.email);
    expect(species).toHaveProperty('value', 'dog');
  });
  it('creates new animals', async () => {
    const client = await createTestClient();
    const animal = await createTestAnimalForClient(client.id);
    expect(animal.id).not.toBeFalsy();
  });
  it('finds animals by name, species and client_id', async () => {
    const client = await createTestClient();
    const animal = await createTestAnimalForClient(client.id);
    const foundAnimal = await ClientService.findAnimal(animal, client.id);
    expect(foundAnimal).toHaveProperty('name', animal.name);
    expect(foundAnimal).toHaveProperty('species_id', animal.species_id);
    expect(foundAnimal).toHaveProperty('client_id', client.id);
  });
});
