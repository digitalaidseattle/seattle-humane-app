import { Client } from '@types';
import { ClientService } from 'src/services/ClientService';
import supabaseClient from 'utils/supabaseClient';

const testClient: Omit<Client, 'id'> = {
  email: 'sh-test@digitalseattle.org',
  first_name: 'John',
  last_name: 'Smith',
  phone: '5555555555',
  postal_code: '55555',
  previously_used: 'false',
};
// These tests require the database to be running locally
// Run `npx supabase start` and set the needed vars your .env.test
// i.e. the URI with the anon_key
describe('ClientService', () => {
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

  it('creates new clients', async () => {
    const client = await createTestClient();
    expect(client).toHaveProperty('email', testClient.email);
    expect(client.id).not.toBeFalsy();
  });
  it('finds clients by email', async () => {
    await createTestClient();
    const client = await ClientService.findByEmail(testClient.email);
    expect(client).toHaveProperty('email', testClient.email);
  });
});
