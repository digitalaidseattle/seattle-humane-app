import { Animal, AppConstant, Client } from '@types';
import { AppConstants } from 'src/constants';
import { AnimalService } from 'src/services/AnimalService';
import supabaseClient from 'utils/supabaseClient';

const testClientInput: Omit<Client, 'id'> = {
  email: 'sh-test@digitalseattle.org',
  first_name: 'John',
  last_name: 'Smith',
  phone: '5555555555',
  postal_code: '55555',
  previously_used: 'false',
};
const testSpeciesInput: Pick<AppConstant, 'type' | 'label' | 'value'> = {
  type: AppConstants.Species,
  label: 'Dog',
  value: 'dog',
};
const testAnimalInput: Omit<Animal, 'id' | 'client_id'> = {
  age: 5,
  name: 'Sparky',
  species_id: null, // species must be
  weight: 15,
};
// These tests require the database to be running locally
// Run `npx supabase start` and set the needed vars your .env.test
// i.e. the URI with the anon_key
describe('AnimalService', () => {
  let testClient: Client;
  beforeAll(async () => {
    ({ data: testClient } = await supabaseClient.from('clients').insert(testClientInput)
      .select().maybeSingle());
  });
  /**
   * Clean up data before tests run, as its possible old test data remains
   * from previous run
   */
  beforeEach(async () => {
    await supabaseClient.from('pets').delete().eq('name', testAnimalInput.name);
  });
  /**
   * Clean up data after tests run to keep tests independent
   */
  afterEach(async () => {
    await supabaseClient.from('pets').delete().eq('name', testAnimalInput.name);
    await supabaseClient.from('app_constants').delete().eq('type', testSpeciesInput.type);
  });

  afterAll(async () => {
    await supabaseClient.from('pets').delete().eq('name', testAnimalInput.name);
    await supabaseClient.from('app_constants').delete().eq('type', testSpeciesInput.type);
  });
  // helpers for commonly used functions
  const createTestSpecies = () => AnimalService.createSpecies(testSpeciesInput);

  const createTestAnimalForClient = async (client_id: string) => {
    const species = await createTestSpecies();
    return AnimalService
      .createAnimal({ ...testAnimalInput, species_id: species.id }, client_id);
  };

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
    const animal = await createTestAnimalForClient(testClient.id);
    expect(animal.id).not.toBeFalsy();
  });
  it('finds animals by name, species and client_id', async () => {
    const animal = await createTestAnimalForClient(testClient.id);
    const foundAnimal = await AnimalService.findAnimal(animal, testClient.id);
    expect(foundAnimal).toHaveProperty('name', animal.name);
    expect(foundAnimal).toHaveProperty('species_id', animal.species_id);
    expect(foundAnimal).toHaveProperty('client_id', testClient.id);
  });
});
