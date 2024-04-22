/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable class-methods-use-this */

/**
 *  ClientService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import {
  AppConstantTypes,
  ClientTicket, ServiceStatus, Statuses,
} from '@lib';
import {
  ClientSchema,
  ServiceRequestSchema,
  AnimalSchemaInsert,
  ServiceRequestSchemaInsert,
  ClientSchemaInsert,
  AppConstantSchema,
  AnimalSchema,
} from '@types';
import supabaseClient from '../../utils/supabaseClient';

export default class ClientService {
  // constructor(private supabaseClient: SupabaseClient) { }

  // TODO remove when in prod
  tickets: ClientTicket[] = [
    new ClientTicket({ ticketNo: '1234', type: 'email', name: 'John Doe' }),
  ];

  static async getClients(): Promise<ClientSchema[]> {
    const { data: clients, error: clientError } = await supabaseClient
      .from('clients')
      .select();
    if (clientError) throw new Error(`Client upsert failed: ${clientError.message}`);
    return clients;
  }

  static async upsertClient(client: ClientSchemaInsert): Promise<ClientSchema> {
    const { data: clientResponse, error: clientError } = await supabaseClient
      .from('clients')
      .upsert({
        email: client.email,
        first_name: client.first_name,
        last_name: client.last_name,
        phone: client.phone,
        postal_code: client.postal_code,
        previously_used: client.previously_used,
      }, { onConflict: 'email' })
      .select().maybeSingle();
    if (clientError) throw new Error(`Client upsert failed: ${clientError.message}`);
    return clientResponse;
  }

  static async insertPet(pet: AnimalSchemaInsert): Promise<AnimalSchema> {
    const { data: petResponse, error } = await supabaseClient
      .from('pets')
      .insert({
        name: pet.name,
        species_id: pet.species_id,
        weight: pet.weight,
        client_id: pet.client_id,
      }).select().maybeSingle();
    if (error) throw new Error(`Pet insertion failed: ${error.message}`);
    return petResponse;
  }

  static async insertRequest(
    request: ServiceRequestSchemaInsert,
  ): Promise<ServiceRequestSchema> {
    const {
      description,
      client_id,
      pet_id,
      service_category_id,
      request_source_id,
      team_member_id,
    } = request;
    const { data: requestResponse, error } = await supabaseClient
      .from('service_requests')
      .insert({
        client_id,
        pet_id,
        service_category_id,
        request_source_id,
        description,
        team_member_id,
      }).select().maybeSingle();
    if (error) throw new Error(`Request insertion failed: ${error.message}`);
    return requestResponse;
  }

  async newRequest(
    serviceInfo: ServiceRequestSchemaInsert,
    clientInfo: ClientSchemaInsert,
    petInfo: AnimalSchemaInsert,
  )
    : Promise<ServiceRequestSchema> {
    // Post Request to supabase

    try {
      const client = await ClientService.upsertClient(clientInfo);
      const pet = await ClientService.insertPet({
        ...petInfo,
        client_id: client.id,
      });
      return await ClientService.insertRequest({
        description: serviceInfo.description,
        service_category_id: serviceInfo.service_category_id,
        request_source_id: serviceInfo.request_source_id,
        team_member_id: serviceInfo.team_member_id,
        pet_id: pet.id,
        client_id: client.id,
      });
    } catch (error) {
      throw new Error(`New Request creation failed: ${error.message}`);
    }
  }

  async getClientByEmail(email: string): Promise<ClientSchema> {
    const { data, error } = await supabaseClient
      .from('clients')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      throw new Error(`Error retrieving client by email: ${error.message}`);
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

  async getServiceCategories(): Promise<AppConstantSchema[]> {
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
      .eq('type', AppConstantTypes.ServiceCategory);
    return response.data;
  }
}

const clientService = new ClientService();
export {
  ClientTicket,
  clientService,
};
