/**
 *  DataService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { AppConstants } from 'src/constants';
import type {
  ClientType,
  ServiceRequestType,
  AnimalType,
  EditableServiceRequestType,
  EditableClientType,
  EditableAnimalType,
  AppConstantType,
  TeamMemberType,
  ServiceRequestSummary,
} from '@types';
import supabaseClient from '@utils/supabaseClient';
import throwIfMissingRequiredFields from '@utils/throwIfMissingRequiredFields';
import { getWeekStartDate } from '@utils/timeUtils';

const SEARCH_RESULT_LIMIT = 100;

export async function createClient(client: EditableClientType) {
  throwIfMissingRequiredFields('client', client);
  const { data: newClient, error } = await supabaseClient
    .from('clients')
    .insert([{
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email,
      phone: client.phone,
      zip_code: client.zip_code,
    }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return newClient;
}

export async function createAnimal(animal: EditableAnimalType, clientId: ClientType['id']) {
  throwIfMissingRequiredFields('animal', animal);
  const { data: newAnimal, error } = await supabaseClient
    .from('pets')
    .insert([{
      name: animal.name,
      species: animal.species,
      client_id: clientId,
      age: animal.age,
      weight: animal.weight,
    }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return newAnimal;
}

export async function createTicket(
  ticket: EditableServiceRequestType,
  clientId: ClientType['id'],
  petId: AnimalType['id'],
) {
  throwIfMissingRequiredFields('ticket', ticket);
  const { data: newTicket, error } = await supabaseClient
    .from('service_requests')
    .insert([{
      client_id: clientId,
      pet_id: petId,
      description: ticket.description,
      service_category: ticket.service_category,
      request_source: ticket.request_source,
      status: ticket.status,
      team_member_id: ticket.team_member_id,
    }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return newTicket;
}

export async function getTicket(ticketId: ServiceRequestType['id']) {
  const { data: ticket, error } = await supabaseClient
    .from('service_requests')
    .select()
    .eq('id', ticketId)
    .single();
  if (error) throw new Error(error.message);
  return ticket;
}

export async function getTicketsThisWeek(): Promise<ServiceRequestType[]> {
  const startOfWeek: Date = getWeekStartDate();
  const { data, error } = await supabaseClient
    .from('service_requests')
    .select()
    .gte('created_at', startOfWeek.toISOString());
  if (error) throw new Error(error.message);
  return data;
}

export async function getServiceRequestByEmail(email: string): Promise<(ServiceRequestSummary & {
  client: {
    firstName: string,
    email: string
  },
  pets: Omit<AnimalType, 'client_id' | 'id'>,
  category: string
})[]> {
  const query = supabaseClient
    .from('service_requests')

    .select(`
    id,
    description,
    created_at,
    service_category,
    clients(first_name, email),
    pets(name, species, weight, age),
    team_members(first_name, email),
    urgent,
    status,
    modified_at
    `)
    .order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.log('ERROR', error.message);
    throw new Error(`${error.message}`);
  }
  const { data: constants, error: categoryError } = await supabaseClient
    .from('app_constants')
    .select('*')
    .eq('type', 'category');
  if (categoryError) throw new Error(categoryError.message);
  const categoryMap = new Map(constants.map((constant) => ([constant.id, constant.label])));

  const summaries = data
    .filter(({ clients }) => clients.email === email)
    .map(({
      clients, pets, team_members, service_category, id, ...ticket
    }) => ({
      id,
      client: {
        firstName: clients.first_name,
        email: clients.email,
      },
      pets: {
        name: pets.name,
        speices: pets.species,
        weight: pets.weight,
        age: pets.age,
      },
      team_member: {
        first_name: team_members.first_name,
        email: team_members.email,
      },
      category: categoryMap.get(service_category),
      created_at: ticket.created_at,
      description: ticket.description,
      urgent: ticket.urgent,
      status: ticket.status,
      modified_at: ticket.modified_at,
    }));
  return summaries;
}

export async function getServiceRequestSummary(ids?: string[]): Promise<ServiceRequestSummary[]> {
  let query = supabaseClient
    .from('service_requests')

    .select(`
    id,
    description,
    created_at,
    service_category,
    clients(first_name),
    pets(name),
    team_members(first_name, email),
    urgent,
    status,
    modified_at
    `)
    .order('created_at', { ascending: false });
  if (ids) {
    query = query.in('id', ids.slice(undefined, SEARCH_RESULT_LIMIT));
  }
  const { data, error } = await query;

  if (error) {
    console.log('ERROR', error.message, 'ids', ids);
    throw new Error(`${error.message}`);
  }
  const { data: constants, error: categoryError } = await supabaseClient
    .from('app_constants')
    .select('*')
    .eq('type', 'category');
  if (categoryError) throw new Error(categoryError.message);
  const categoryMap = new Map(constants.map((constant) => ([constant.id, constant.label])));

  const summaries = data.map(({
    clients, pets, team_members, service_category, id, ...ticket
  }) => ({
    id,
    client: clients.first_name,
    pet: pets.name,
    team_member: {
      first_name: team_members.first_name,
      email: team_members.email,
    },
    category: categoryMap.get(service_category),
    created_at: ticket.created_at,
    description: ticket.description,
    urgent: ticket.urgent,
    status: ticket.status,
    modified_at: ticket.modified_at,
  }));
  return summaries;
}

export async function searchServiceRequests(searchQuery?: string) {
  if (!searchQuery.trim()) return getServiceRequestSummary();

  /**
   * Default to "match all words" by concatenating with "&""
   * https://www.postgresql.org/docs/current/functions-textsearch.html
   */
  const fullTextSearchQuery = searchQuery.split(' ').filter((word) => word.trim().length > 0).join('&');
  const { data, error } = await supabaseClient
    .from('service_requests_search')
    .select('id')
    .textSearch('search_field', fullTextSearchQuery);

  if (error) throw new Error(`${error.message}`);
  return getServiceRequestSummary(data.map(({ id }) => id));
}

export async function getClientByIdOrEmail<T extends keyof Pick<ClientType, 'id' | 'email'>>(
  key: T,
  value: ClientType[T],
): Promise<ClientType> {
  const { data, error } = await supabaseClient
    .from('clients')
    .select('*')
    .eq(key, value)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getPetById(id: AnimalType['id']): Promise<AnimalType> {
  const { data, error } = await supabaseClient
    .from('pets')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getPetByOwner(clientId: ClientType['id'], petName: AnimalType['name']): Promise<AnimalType> {
  const { data, error } = await supabaseClient
    .from('pets')
    .select('*')
    .eq('client_id', clientId)
    .eq('name', petName)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

const appConstants: Map<AppConstants, AppConstantType[]> = new Map();

export async function getAppConstants(type: AppConstants) {
  if (!appConstants.has(type)) {
    const { data: constants, error } = await supabaseClient
      .from('app_constants')
      .select('*')
      .eq('type', type);
    if (error) throw new Error(error.message);
    appConstants.set(type, constants);
  }
  return appConstants.get(type);
}

export async function getTeamMembers(): Promise<TeamMemberType[]> {
  const { data: teamMembers, error } = await supabaseClient
    .from('team_members')
    .select();
  if (error) throw new Error(error.message);
  return teamMembers;
}
