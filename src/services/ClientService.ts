/* eslint-disable @typescript-eslint/naming-convention */
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
// import { Database } from 'supabase/database.types';
// import { QueryData } from '@supabase/supabase-js';
// import { AnimalService, animalService } from 'src/services/AnimalService';
import { Tables } from 'supabase/database.types';
import supabaseClient from '../../utils/supabaseClient';
import {
  ClientType, RequestType as ServiceRequestType, AnimalType, Client, Animal, ServiceRequest,
} from '../types';

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

export class ClientService {
  // constructor(private supabaseClient: SupabaseClient) { }

  // TODO remove when in prod
  tickets: ClientTicket[] = [
    new ClientTicket({ ticketNo: '1234', type: 'email', name: 'John Doe' }),
  ];

  async newRequest(
    request: ServiceRequest,
    client: Client,
    animal: Animal,
  )
    : Promise<ServiceRequestType> {
    // Post Request to supabase

    let createdRequest: ServiceRequestType;

    try {
      let animalId: string;
      let clientId: string;

      // Check if client exists and create one if not
      const existingClient = await ClientService.findByEmail(client.email);

      // TODO: Deal with modifying client information if it already exists
      if (!existingClient) {
        const newClient = await ClientService.createClient(existingClient);
        clientId = newClient.id;
      } else clientId = existingClient.id;

      // Check if animal exists and create one if not
      // TODO: HOW TO IDENTIFY UNIQUE ANIMAL? NAME / SPECIES / CLIENT_ID?
      const existingAnimal = await ClientService.findAnimal(animal, clientId);

      if (!existingAnimal) {
        const newAnimal = await ClientService.createAnimal(existingAnimal, clientId);
        animalId = newAnimal.id;
      } else animalId = existingAnimal.id;

      // Create new request
      createdRequest = await ClientService.createRequest(client.id, animal.id, request);
    } catch (error) {
      console.log('ERROR AT NEW REQUEST CREATION:', error);
      throw error;
    }
    // TODO: ChangeLog not currently implemented
    return Promise.resolve(createdRequest);
  }

  static async findByEmail(email: string) {
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

  static async createClient(clientInput: Omit<Client, 'id'>) {
    const {
      first_name, last_name, email, phone,
    } = clientInput;
    const { data: newClient, error } = await supabaseClient
      .from('clients')
      .insert({
        first_name,
        last_name,
        email,
        phone,
      })
      .select()
      .maybeSingle();
    if (error) throw new Error(`Client creation failed: ${error.message}`);
    return newClient;
  }

  static async findAnimal(animalInput: Animal, client_id: Client['id']) {
    const { name, species_id } = animalInput;
    const { data: animal, error: animalError } = await supabaseClient
      .from('pets')
      .select('*')
      .eq('name', name)
      .eq('species', species_id)
      .eq('client_id', client_id)
      .maybeSingle();

    if (animalError) throw new Error(`Animal retrieval failed: ${animalError.message}`);
    return animal;
  }

  static async createAnimal(animalInput: Omit<Animal, 'id' | 'client_id'>, client_id: Client['id']) {
    const { name, species_id } = animalInput;
    const { data: newAnimal, error } = await supabaseClient
      .from('pets')
      .insert({
        name,
        species_id,
        client_id,
      })
      .select()
      .maybeSingle();

    if (error) throw new Error(`Animal creation failed: ${error.message}`);
    return newAnimal;
  }

  static async createRequest(client_id: Client['id'], animal_id: Animal['id'], requestInput: ServiceRequest) {
    const { service_category_id, request_source_id, team_member_id } = requestInput;
    const { data: request, error } = await supabaseClient
      .from('requests')
      .insert([{
        client_id,
        animal_id,
        service_category_id,
        request_source_id,
        team_member_id,
      }])
      .select()
      .maybeSingle();
    if (error) throw new Error(`Request creation failed: ${error.message}`);
    return request;
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

  async getServiceCategories() {
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
