/* eslint-disable class-methods-use-this */

/**
 *  ClientService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import {
  ClientTicket, ServiceCategory, ServiceStatus, Statuses,
} from '@lib';
import supabaseClient from '../../utils/supabaseClient';
import { ClientSchema, ServiceRequestSchema as ServiceRequestType, AnimalType } from '../types';

export async function upsertClient(client: ClientSchema) {
  const { data: clientResponse, error: clientError } = await supabaseClient
    .from('clients')
    .upsert({
      email: client.email,
      first_name: client.first_name,
      last_name: client.last_name,
      phone: client.phone,
      postal_code: client.postal_code,
      previously_used: client.previously_used,
    }, { onConflict: 'email' }) as { data: ClientSchema | null, error: Error };
  if (clientError) throw new Error(`Client retrieval failed: ${clientError.message}`);
  return clientResponse;
}

export async function insertPet(pet: AnimalType) {
  const { data: petResponse, error: petError } = await supabaseClient
    .from('pets')
    .insert({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      weight: pet.weight,
      client_id: pet.client_id,
    }) as { data: AnimalType | null, error: Error };
  if (petError) throw new Error(`Client retrieval failed: ${petError.message}`);
  return petResponse;
}

export async function insertRequest(request: ServiceRequestType) {
  const { data: requestResponse, error: requestError } = await supabaseClient
    .from('requests')
    .insert({
      client_id: request.client_id,
      animal_id: request.animal_id,
      service_category: request.service_category,
      priority: request.priority,
      source: request.source,
      description: request.description,
      status: request.status,
      staff_id: request.staff_id,
    }) as { data: ServiceRequestType | null, error: Error };
  if (requestError) throw new Error(`Client retrieval failed: ${requestError.message}`);
  return requestResponse;
}

class ClientService {
  // constructor(private supabaseClient: SupabaseClient) { }

  // TODO remove when in prod
  tickets: ClientTicket[] = [
    new ClientTicket({ ticketNo: '1234', type: 'email', name: 'John Doe' }),
  ];

  async newRequest(
    request: ServiceRequestType,
    client: ClientSchema,
    animal: AnimalType,
  )
    : Promise<ServiceRequestType> {
    // Post Request to supabase

    try {
      // Await both the upsertClient and insertPet
      // so that we can't return from this call until everything is done
      const clientPromise = upsertClient(client);
      const petPromise = insertPet(animal);
      await Promise.all([clientPromise, petPromise]);
      return await insertRequest(request);
    } catch (error) {
      console.error('ERROR AT NEW REQUEST CREATION:', error);
      throw error;
    }
  }

  async getClientByEmail(email: string): Promise<ClientSchema> {
    const { data, error } = await supabaseClient
      .from('clients')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.log('ERROR IN GET CLIENT BY EMAIL:', error);
      throw new Error(error.message);
    }

    if (!data) throw new Error('No client found with this email');

    return data;
  }

  getTicket(id: string): Promise<ClientTicket> {
    return Promise.resolve(this.tickets.find((t) => t.ticketNo === id));
  }

  getTickets(): Promise<ClientTicket[]> {
    return Promise.resolve(this.tickets);
    // return fetch(this.contextPath + '/demo/data/countries.json', { headers: { 'Cache-Control': 'no-cache' } })
    //   .then((res) => res.json())
    //   .then((d) => d.data);
  }

  update(ticket: ClientTicket): Promise<ClientTicket> {
    this.tickets = this.tickets.map((obj) => (ticket.ticketNo === obj.ticketNo ? ticket : obj));
    return Promise.resolve(this.tickets.find((t) => t.ticketNo === ticket.ticketNo));
  }

  async getServiceStatuses(): Promise<ServiceStatus[]> {
    // REVIEW: Could be from DB
    return Promise.resolve(Statuses);
  }

  async getServiceCategories(): Promise<ServiceCategory[]> {
    // For Testing without DB
    // const tempCategories: ServiceCategory[] = [
    //   new ServiceCategory({ id: 'id_1', name: 'Cat One' }),
    //   new ServiceCategory({ id: 'id_2', name: 'Cat Two' }),
    //   new ServiceCategory({ id: 'id_3', name: 'Dog Adoption' }),
    //   new ServiceCategory({ id: 'id_4', name: 'Pet Fostering' })
    // ]
    // return Promise.resolve(tempCategories);

    const response = await supabaseClient
      .from('service_category')
      .select('*');
    return response.data;
  }
}

const clientService = new ClientService();
export {
  ClientTicket,
  clientService,
};
