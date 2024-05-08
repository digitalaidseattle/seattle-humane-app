import { Database, Tables } from '../supabase/database.types';

// MAIN DATA TYPES
// Current approach is to keep Domain models and Database models the same. If/when
// they diverge, we can create separate types for each and use a mapping function
// ID's are optional as they are not known until the data is persisted in DB

// INCOMPLETE: more fields to be added when confirmed as required

// EXAMPLE of Client type as imported from supabase;
export type ClientTypeExample = Database['public']['Tables']['clients']['Insert'];

export type ClientType = Tables<'clients'>;

export type EditableClientType = Omit<ClientType, 'id'>;

// INCOMPLETE: more fields to be added when confirmed as required
export type AnimalType = Tables<'pets'>;

export type EditableAnimalType = Omit<AnimalType, 'id' | 'client_id'>;

// INCOMPLETE: more fields to be added when confirmed as required
export type ServiceRequestType = Tables<'service_requests'>;

export type EditableServiceRequestType = Omit<ServiceRequestType, 'id' | 'created_at'>;

export type AppConstantType = Tables<'app_constants'>;

export type SearchOptions = {
  first: number;
  page: number;
  pageCount: number;
  rows: number;
};
