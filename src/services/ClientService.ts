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
import { AppConstants } from 'src/constants';
import {
  ClientType,
  ServiceRequestType,
  AnimalType,
  EditableServiceRequestType,
  EditableClientType,
  EditableAnimalType,
  AppConstantType,
} from '@types';
import supabaseClient from '../../utils/supabaseClient';

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

class ClientService {
  // constructor(private supabaseClient: SupabaseClient) { }

  // TODO remove when in prod
  tickets: ClientTicket[] = [
    new ClientTicket({ ticketNo: '1234', type: 'email', name: 'John Doe' }),
  ];

  async newRequest(
    request: EditableServiceRequestType,
    client: EditableClientType,
    animal: EditableAnimalType,
  )
    : Promise<ServiceRequestType> {
    // Post Request to supabase

    let createdRequest: ServiceRequestType;

    try {
      let animalId: string;
      let clientId: string;

      // Check if client exists and create one if not
      // No Upsert operations currently in the supabaseClient library AFAIK
      const { data: existingClient, error: clientError } = await supabaseClient
        .from('clients')
        .select('*')
        // Here assumes that email is unique and required; may need to also check phone
        .eq('email', client.email)
        .single();

      if (clientError) throw new Error(`Client retrieval failed: ${clientError.message}`);

      // TODO: Deal with modifying client information if it already exists
      if (!existingClient) {
        const { data: newClient, error } = await supabaseClient
          .from('clients')
          .insert([{
            first_name: client.first_name,
            last_name: client.last_name,
            email: client.email,
            phone_number: client.phone_number,
          }])
          .select()
          .single();
        if (error) throw new Error(`Client creation failed: ${error.message}`);
        if (newClient) clientId = newClient.id;
      } else clientId = existingClient.id;

      // Check if animal exists and create one if not
      // TODO: HOW TO IDENTIFY UNIQUE ANIMAL? NAME / SPECIES / CLIENT_ID?
      const { data: existingAnimal, error: animalError } = await supabaseClient
        .from('pets')
        .select('*')
        .eq('name', animal.name)
        .eq('species_id', animal.species_id)
        .eq('client_id', clientId)
        .maybeSingle() as { data: AnimalType | null, error: Error };

      if (animalError) throw new Error(`Animal retrieval failed: ${animalError.message}`);

      if (!existingAnimal) {
        const { data: newAnimal, error } = await supabaseClient
          .from('pets')
          .insert([{
            name: animal.name,
            species_id: animal.species_id,
            client_id: clientId,
          }]) as { data: AnimalType | null, error: Error };
        if (error) throw new Error(`Animal creation failed: ${error.message}`);
        if (newAnimal) animalId = newAnimal.id;
      } else animalId = existingAnimal.id;

      // Create new request
      const { data: newRequest, error } = await supabaseClient
        .from('service_requests')
        .insert([{
          client_id: clientId,
          animal_id: animalId,
          service_category_id: request.service_category_id,
          request_source_id: request.request_source_id,
          team_member_id: request.team_member_id,
        }])
        .select()
        .single();
      if (error) throw new Error(`Request creation failed: ${error.message}`);
      else createdRequest = newRequest;
    } catch (error) {
      console.log('ERROR AT NEW REQUEST CREATION:', error);
      throw error;
    }
    // TODO: ChangeLog not currently implemented
    return Promise.resolve(createdRequest);
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

  async getServiceStatuses(): Promise<AppConstantType[]> {
    const response = await supabaseClient
      .from('app_constants')
      .select('*')
      .eq('type', AppConstants.Status);
    return response.data;
  }

  async getServiceCategories(): Promise<AppConstantType[]> {
    // For Testing without DB
    // const tempCategories: ServiceCategory[] = [
    //   new ServiceCategory({ id: 'id_1', name: 'Cat One' }),
    //   new ServiceCategory({ id: 'id_2', name: 'Cat Two' }),
    //   new ServiceCategory({ id: 'id_3', name: 'Dog Adoption' }),
    //   new ServiceCategory({ id: 'id_4', name: 'Pet Fostering' })
    // ]
    // return Promise.resolve(tempCategories);

    const response = await supabaseClient
      .from('app_constants')
      .select('*')
      .eq('type', AppConstants.Category);
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
