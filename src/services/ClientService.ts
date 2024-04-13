/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-throw-literal */
/* eslint-disable no-useless-catch */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
/**
 *  ClientService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import supabaseClient from '../../utils/supabaseClient';
import { AnimalType, ClientType, RequestType as ServiceRequestType } from '../types';

enum RequestType {
  clientNew = 'client-new',
  clientUpdate = 'client-new',
  animalNew = 'animal-new',
  animalUpdate = 'animal-update',
}

type SearchOptions = {
  first: number,
  page: number,
  pageCount: number,
  rows: number,
};

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

class ClientService {
  // constructor(private supabaseClient: SupabaseClient) { }

  async newRequest(
    request: ServiceRequestType,
    client: ClientType,
    animal: AnimalType,
  )
    : Promise<ServiceRequestType> {
    // Post Request to supabase

    let createdRequest: ServiceRequestType;

    try {
      let animalId: BigInteger;
      let clientId: BigInteger;

      // Check if client exists and create one if not
      // No Upsert operations currently in the supabaseClient library AFAIK
      const { data: existingClient, error: clientError } = await supabaseClient
        .from('clients')
        .select('*')
        // Here assumes that email is unique and required; may need to also check phone
        .eq('email', client.email)
        .single() as { data: ClientType | null, error: Error };

      if (clientError) throw new Error(`Client retrieval failed: ${clientError.message}`);

      // TODO: Deal with modifying client information if it already exists
      if (!existingClient) {
        const { data: newClient, error } = await supabaseClient
          .from('clients')
          .insert([{
            first_name: client.first_name,
            last_name: client.last_name,
            email: client.email,
            phone: client.phone,
          }]) as { data: ClientType | null, error: Error };
        if (error) throw new Error(`Client creation failed: ${error.message}`);
        if (newClient) clientId = newClient.id;
      } else clientId = existingClient.id;

      // Check if animal exists and create one if not
      // TODO: HOW TO IDENTIFY UNIQUE ANIMAL? NAME / SPECIES / CLIENT_ID?
      const { data: existingAnimal, error: animalError } = await supabaseClient
        .from('animals')
        .select('*')
        .eq('name', animal.name)
        .eq('species', animal.species)
        .eq('client_id', clientId)
        .maybeSingle() as { data: AnimalType | null, error: Error };

      if (animalError) throw new Error(`Animal retrieval failed: ${animalError.message}`);

      if (!existingAnimal) {
        const { data: newAnimal, error } = await supabaseClient
          .from('animals')
          .insert([{
            name: animal.name,
            species: animal.species,
            client_id: clientId,
          }]) as { data: AnimalType | null, error: Error };
        if (error) throw new Error(`Animal creation failed: ${error.message}`);
        if (newAnimal) animalId = newAnimal.id;
      } else animalId = existingAnimal.id;

      // Create new request
      const { data: newRequest, error } = await supabaseClient
        .from('requests')
        .insert([{
          client_id: clientId,
          animal_id: animalId,
          service_category: request.service_category,
          source: request.source,
          staff_id: request.staff_id,
        }]) as { data: ServiceRequestType | null, error: Error };
      if (error) throw new Error(`Request creation failed: ${error.message}`);
      else createdRequest = newRequest;
    } catch (error) {
      console.error('ERROR AT NEW REQUEST CREATION:', error);
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
        console.error('ERROR IN GET CLIENT BY EMAIL:', error);
        throw error;
      }

      if (!data) throw new Error('No client found with this email');

      return data;
    } catch (error) {
      throw error;
    }
  }

  async update(request: ServiceRequestType): Promise<ServiceRequestType> {
    // FIXME should be update
    return supabaseClient
      .from('service_requests')
      .select('*')
      .single()
      .then((resp) => resp.data);
  }

  async getServiceRequest(id: string): Promise<ServiceRequestType> {
    return supabaseClient
      .from('service_requests')
      .select('*')
      .eq('id', id)
      .single()
      .then((resp) => resp.data);
  }

  async getServiceRequests(opts: SearchOptions): Promise<ServiceRequestType[]> {
    return supabaseClient
      .from('service_requests')
      .select('*, team_members(*)')
      .range(opts.first, opts.first + opts.rows)
      .then((resp) => resp.data);
  }

  async getServiceRequestsTotalRecords(): Promise<number> {
    return supabaseClient
      .from('service_requests')
      .select('*, team_members(*)', { count: 'exact', head: true })
      .then((resp) => resp.count);
  }
}

const clientService = new ClientService();
export {
  clientService,
  ClientService,
};

export type { SearchOptions };
