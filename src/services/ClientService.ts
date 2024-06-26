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
import { AppConstants } from 'src/constants';
import {
  ClientType,
  ServiceRequestType,
  AnimalType,
  EditableServiceRequestType,
  EditableClientType,
  EditableAnimalType,
  AppConstantType,
  TeamMemberType,
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

  appConstants: Map<AppConstants, AppConstantType[]> = new Map();

  async newRequest(
    request: EditableServiceRequestType,
    client: EditableClientType,
    animal: EditableAnimalType,
  )
    : Promise<ServiceRequestType> {
    // Post Request to supabase

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
        .maybeSingle();

      if (clientError) throw new Error(`Client retrieval failed: ${clientError.message}`);

      // TODO: Deal with modifying client information if it already exists
      if (!existingClient) {
        const newClient = await ClientService.createClient(client);
        clientId = newClient.id;
      } else clientId = existingClient.id;

      // Check if animal exists and create one if not
      // TODO: HOW TO IDENTIFY UNIQUE ANIMAL? NAME / SPECIES / CLIENT_ID?
      if (!animal.species) throw new Error('Animal species is required');
      const { data: existingAnimal, error: animalError } = await supabaseClient
        .from('pets')
        .select('*')
        .eq('name', animal.name)
        .eq('species', animal.species)
        .eq('client_id', clientId)
        .maybeSingle();

      if (animalError) throw new Error(`Animal retrieval failed: ${animalError.message}`);

      if (!existingAnimal) {
        const newAnimal = await ClientService.createAnimal(animal, clientId);
        animalId = newAnimal.id;
      } else animalId = existingAnimal.id;

      // Create new ticket
      const ticket = await ClientService.createTicket(request, clientId, animalId);
      return ticket;
    } catch (error) {
      console.log('ERROR AT NEW REQUEST CREATION:', error);
      throw error;
    }
    // TODO: ChangeLog not currently implemented
  }

  static validFieldsByType: {
    client: (keyof ClientType)[],
    animal: (keyof AnimalType)[],
    ticket: (keyof ServiceRequestType)[]
  } = {
      client: ['first_name', 'last_name', 'email', 'phone'],
      animal: ['name', 'age', 'weight', 'species'],
      ticket: ['service_category', 'request_source', 'team_member_id'],
    };

  static throwIfInvalidInput(
    type: keyof typeof ClientService.validFieldsByType,
    data: any,
  ) {
    const missingFields = [];
    const fields = ClientService.validFieldsByType[type];
    fields.forEach((field) => {
      if (!data[field]) missingFields.push(field);
    });
    if (missingFields.length) throw new Error(`Cannot create the ${type} as the following information was missing: ${missingFields.join(',')}`);
    return true;
  }

  static async createClient(client: EditableClientType) {
    ClientService.throwIfInvalidInput('client', client);
    const {

      first_name, last_name, email, phone, zip_code,
    } = client;
    const { data: newClient, error } = await supabaseClient
      .from('clients')
      .insert([{
        first_name, last_name, email, phone, zip_code,
      }])
      .select()
      .single();
    if (error) throw new Error(`Client creation failed: ${error.message}`);
    return newClient;
  }

  static async createAnimal(animal: EditableAnimalType, clientId: ClientType['id']) {
    ClientService.throwIfInvalidInput('animal', animal);
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
    if (error) throw new Error(`Animal creation failed: ${error.message}`);
    return newAnimal;
  }

  static async createTicket(
    ticket: EditableServiceRequestType,
    clientId: ClientType['id'],
    petId: AnimalType['id'],
  ) {
    ClientService.throwIfInvalidInput('ticket', ticket);
    const { data: newTicket, error } = await supabaseClient
      .from('service_requests')
      .insert([{
        client_id: clientId,
        pet_id: petId,
        description: ticket.description,
        service_category: ticket.service_category,
        request_source: ticket.request_source,
        team_member_id: ticket.team_member_id,
      }])
      .select()
      .single();
    if (error) throw new Error(`Request creation failed: ${error.message}`);
    return newTicket;
  }

  static async getTicket(ticketId: ServiceRequestType['id']) {
    const { data: ticket, error } = await supabaseClient
      .from('service_requests')
      .select()
      .eq('id', ticketId)
      .single();
    if (error) throw new Error(`${error.message}`);
    return ticket;
  }

  static async getRecentTickets() {
    const { data: tickets, error } = await supabaseClient
      .from('service_requests')
      .select()
      .order('created_at', { ascending: false })
      .limit(10);
    if (error) throw new Error(`${error.message}`);
    return tickets;
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

  static async getClientByKeyValue<T extends keyof ClientType>(
    key: T,
    value: ClientType[T],
  ): Promise<ClientType> {
    try {
      const { data, error } = await supabaseClient
        .from('clients')
        .select('*')
        .eq(key, value)
        .maybeSingle();

      if (error) {
        console.log(`ERROR IN GET CLIENT BY ${key}:`, error);
        throw error;
      }

      if (!data) throw new Error(`No client found with the provided ${key}`);

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

  async getAppConstants(type: AppConstants) {
    if (!this.appConstants.has(type)) {
      const { data: constants, error } = await supabaseClient
        .from('app_constants')
        .select('*')
        .eq('type', type);
      if (error) throw new Error(error.message);
      this.appConstants.set(type, constants);
    }
    return this.appConstants.get(type);
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

  async getTeamMembers(): Promise<TeamMemberType[]> {
    const { data: teamMembers, error } = await supabaseClient
      .from('team_members')
      .select();
    if (error) throw new Error(error.message);
    return teamMembers;
  }
}

const clientService = new ClientService();
export default ClientService;
export {
  ClientTicket,
  NewClientRequest,
  ServiceCategory,
  ServiceStatus,
  TicketType,
  clientService,
};
