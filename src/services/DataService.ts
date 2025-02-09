/* eslint-disable @typescript-eslint/naming-convention */
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
  PetType,
  EditableServiceRequestType,
  EditableClientType,
  EditablePetType,
  AppConstantType,
  TeamMemberType,
  ServiceRequestSummary,
} from '@types';
import supabaseClient from '@utils/supabaseClient';
import throwIfMissingRequiredFields from '@utils/throwIfMissingRequiredFields';
import { getWeekStartDate } from '@utils/timeUtils';

export async function createClient(client: EditableClientType) {
  throwIfMissingRequiredFields('client', client);
  const { data: newClient, error } = await supabaseClient
    .from('clients')
    .insert([
      {
        first_name: client.first_name,
        last_name: client.last_name,
        email: client.email,
        phone: client.phone,
        zip_code: client.zip_code,
      },
    ])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return newClient;
}

export async function updateClient(clientInput: ClientType) {
  throwIfMissingRequiredFields('client', clientInput);
  // update all fields except the ID
  const {
    email, first_name, last_name, phone, zip_code,
  } = clientInput;
  const { error, data: client } = await supabaseClient.from('clients')
    .update({
      email, first_name, last_name, phone, zip_code,
    })
    .eq('id', clientInput.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return client;
}

export async function createAnimal(
  animal: EditablePetType,
  clientId: ClientType['id'],
) {
  throwIfMissingRequiredFields('animal', animal);
  const { data: newAnimal, error } = await supabaseClient
    .from('pets')
    .insert([
      {
        name: animal.name,
        species: animal.species,
        client_id: clientId,
        age: animal.age,
        weight: animal.weight,
      },
    ])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return newAnimal;
}

export async function updateAnimal(clientInput: ClientType, petInput: PetType) {
  throwIfMissingRequiredFields('animal', petInput);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const client = await getClientByIdOrEmail('email', clientInput.email);
  if (!client) throw new Error(`Failed to updat the pet because the client with email ${clientInput.email} could not be found`);

  // update all fields except the ID
  const {
    age, name, species, weight,
  } = petInput;
  const { error, data: pet } = await supabaseClient.from('pets')
    .update({
      age, name, species, weight,
    })
    .eq('client_id', client.id)
    .eq('id', petInput.id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return pet;
}

export async function createTicket(
  ticket: EditableServiceRequestType,
  clientId: ClientType['id'],
  petId: PetType['id'],
) {
  throwIfMissingRequiredFields('ticket', ticket);
  const { data: newTicket, error } = await supabaseClient
    .from('service_requests')
    .insert([
      {
        client_id: clientId,
        pet_id: petId,
        description: ticket.description,
        service_category: ticket.service_category,
        request_source: ticket.request_source,
        status: ticket.status,
        team_member_id: ticket.team_member_id,
      },
    ])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return newTicket;
}

export async function updateTicket(
  ticketInput: ServiceRequestType,
) {
  throwIfMissingRequiredFields('ticket', ticketInput);
  // allow changing all fields except some of the IDs
  const {
    description, request_source, service_category, status, team_member_id, urgent,
  } = ticketInput;
  const { data: ticket, error } = await supabaseClient.from('service_requests')
    .update({
      description,
      request_source,
      service_category,
      status,
      team_member_id,
      urgent,
      modified_at: new Date().toISOString(),
    })
    .eq('id', ticketInput.id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return ticket;
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

export async function getServiceRequestSummary(): Promise<
ServiceRequestSummary[]
> {
  const { data, error } = await supabaseClient
    .from('service_requests')

    .select(
      `
    id,
    description,
    created_at,
    service_category,
    clients(first_name,last_name),
    pets(name,species),
    team_members(first_name,last_name, email),
    urgent,
    status,
    modified_at
    `,
    )
    .order('created_at', { ascending: false });

  if (error) throw new Error(`${error.message}`);
  const { data: constants, error: categoryError } = await supabaseClient
    .from('app_constants')
    .select('*')
    .in('type', ['species', 'category']);
  if (categoryError) throw new Error(categoryError.message);
  const constantsMap = new Map(
    constants.map((constant) => [constant.id, constant.label]),
  );

  const summaries = data.map(
    ({
      clients, pets, team_members, service_category, id, ...ticket
    }) => ({
      id,
      client: { first_name: clients.first_name, last_name: clients.last_name },
      pet: { name: pets.name, species: constantsMap.get(pets.species) },
      team_member: {
        first_name: team_members.first_name,
        last_name: team_members.last_name,
        email: team_members.email,
      },
      service_category: constantsMap.get(service_category),
      created_at: ticket.created_at,
      description: ticket.description,
      urgent: ticket.urgent,
      status: ticket.status,
      modified_at: ticket.modified_at,
    }),
  );
  return summaries;
}

export async function getClientByIdOrEmail<
  T extends keyof Pick<ClientType, 'id' | 'email'>,
>(key: T, value: ClientType[T]): Promise<ClientType> {
  const { data, error } = await supabaseClient
    .from('clients')
    .select('*')
    .eq(key, value)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getPetById(id: PetType['id']): Promise<PetType> {
  const { data, error } = await supabaseClient
    .from('pets')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getPetByOwner(
  clientId: ClientType['id'],
  petName: PetType['name'],
): Promise<PetType> {
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
