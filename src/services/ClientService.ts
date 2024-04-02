/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable no-useless-catch */
/* eslint-disable eqeqeq */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/**
 *  ClientService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import supabaseClient from '../../utils/supabaseClient';
import { ClientType, RequestType as ServiceRequestType, AnimalType } from '../types';

enum RequestType {
  clientNew = 'client-new',
  clientUpdate = 'client-new',
  animalNew = 'animal-new',
  animalUpdate = 'animal-update',
}

enum TicketType {
  walkin = 'walk-in',
  email = 'email',
  phone = 'phone',
  other = 'other',
}

class ServiceCategory {
  id: string;

  name: string;

  constructor(input: any) {
    this.id = input.id;
    this.name = input.name;
  }
}

class ServiceStatus {
  id: string;

  code: string;

  name: string;

  constructor(input: any) {
    this.id = input.id;
    this.code = input.code;
    this.name = input.name;
  }
}
const statuses: ServiceStatus[] = [
  new ServiceStatus({ name: 'New', code: 'new' }),
  new ServiceStatus({ name: 'In-progress', code: 'update' }),
  new ServiceStatus({ name: 'Close', code: 'closed' }),
  new ServiceStatus({ name: 'Blocked', code: 'blocked' }),
];

class NewClientRequest {
  requestType: RequestType = RequestType.clientNew;

  ticketNo: string;

  type: TicketType;

  name: string;

  email: string;

  phone: string;

  summary: string;

  description: string;

  date: Date;

  representative: string;

  constructor(data: any) {
    this.ticketNo = data.ticketNo;
    this.type = data.type;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.summary = data.summary;
    this.description = data.description;
    this.representative = data.representative;
    this.date = data.date ? data.date : new Date();
  }
}

class UpdateClientRequest {
  requestType: RequestType = RequestType.clientUpdate;

  ticketNo: string;

  ticket: ClientTicket;

  date: Date;

  representative: string;

  constructor(ticket: any, date: Date, representative: string) {
    this.ticketNo = ticket.ticketNo;
    this.ticket = ticket;
    this.date = date || new Date();
  }
}

class ChangeLog {
  date: Date;

  representative: string;

  description: string;

  constructor(data: any) {
    this.date = data.date ? data.date : new Date();
    this.description = data.description;
    this.representative = data.representative;
  }
}

class ClientTicket {
  ticketNo: string;

  type: TicketType;

  status: string;

  name: string;

  email: string;

  phone: string;

  summary: string;

  description: string;

  urgency: number;

  changeLog: ChangeLog[] = [];

  serviceCategoryId: string;

  constructor(data: any) {
    this.ticketNo = data.ticketNo;
    this.type = data.type;
    this.name = data.name;
    this.status = data.status;
    this.urgency = data.urgency;
    this.email = data.email;
    this.phone = data.phone;
    this.summary = data.summary;
    this.description = data.description;
    this.serviceCategoryId = data.serviceCategoryId;
  }
}

export async function upsertClient(client: ClientType) {
  const { data: clientResponse, error: clientError } = await supabaseClient
    .from('clients')
    .upsert({
      email: client.email,
      first_name: client.first_name,
      last_name: client.last_name,
      phone: client.phone,
      postal_code: client.postal_code,
      previously_used: client.previously_used,
    }, { onConflict: 'email' }) as { data: ClientType | null, error: Error };
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
    client: ClientType,
    animal: AnimalType,
  )
    : Promise<ServiceRequestType> {
    // Post Request to supabase

    let createdRequest: ServiceRequestType;

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

  async getClientByEmail(email: string): Promise<ClientType> {
    try {
      const { data, error } = await supabaseClient
        .from('clients')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) {
        console.log('ERROR IN GET CLIENT BY EMAIL:', error);
        throw error;
      }

      if (!data) throw new Error('No client found with this email');

      return data;
    } catch (error) {
      throw error;
    }
  }

  getTicket(id: string): Promise<ClientTicket> {
    return Promise.resolve(this.tickets.find((t) => t.ticketNo == id));
  }

  getTickets(): Promise<ClientTicket[]> {
    return Promise.resolve(this.tickets);
    // return fetch(this.contextPath + '/demo/data/countries.json', { headers: { 'Cache-Control': 'no-cache' } })
    //   .then((res) => res.json())
    //   .then((d) => d.data);
  }

  update(ticket: ClientTicket): Promise<ClientTicket> {
    this.tickets = this.tickets.map((obj) => (ticket.ticketNo === obj.ticketNo ? ticket : obj));
    return Promise.resolve(this.tickets.find((t) => t.ticketNo == ticket.ticketNo));
  }

  async getServiceStatuses(): Promise<ServiceStatus[]> {
    // REVIEW: Could be from DB
    return Promise.resolve(statuses);
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
  NewClientRequest,
  ServiceCategory,
  ServiceStatus,
  TicketType,
  clientService,
};
