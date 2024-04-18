import { Database, Tables } from '../supabase/database.types';

// MAIN DATA TYPES
// Current approach is to keep Domain models and Database models the same. If/when
// they diverge, we can create separate types for each and use a mapping function
// ID's are optional as they are not known until the data is persisted in DB

// INCOMPLETE: more fields to be added when confirmed as required

export type AppConstant = Tables<'app_constants'>;

// EXAMPLE of Client type as imported from supabase;
export type ClientTypeExample = Database['public']['Tables']['clients']['Insert'];

export type Client = Tables<'clients'>;
export type ClientType = {
  id?: BigInt;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  postal_code: string;
  previously_used: string;
};
export type EditableClientInfo = Omit<ClientType, 'id'>;

// INCOMPLETE: more fields to be added when confirmed as required
export type Animal = Tables<'pets'>;
export type AnimalType = {
  id?: BigInt;
  name: string;
  species: string;
  breed: string;
  weight: string;
  client_id?: BigInteger;
};
export type EditableAnimalType = Omit<AnimalType, 'id' | 'client_id'>;

// INCOMPLETE: more fields to be added when confirmed as required
export type ServiceRequest = Tables<'service_requests'>;
export type RequestType = {
  id?: BigInt;
  client_id?: BigInt;
  animal_id: BigInt;
  service_category: string;
  priority: string;
  source: string;
  description: string;
  status: string;
  staff_id: BigInt;
};
// TODO use lookup with assigned_to
export type EditableRequestType = Omit<RequestType, 'id' | 'animal_id' | 'staff_id'> & { assigned_to: string };
