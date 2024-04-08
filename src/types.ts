import { Database } from '../supabase/database.types';

// INCOMPLETE: more fields to be added when confirmed as required

export type ClientType = Database['public']['Tables']['clients']['Insert'];
export type EditableClientInfo = Omit<ClientType, 'id'>;

export type AnimalTypeExample = Database['public']['Tables']['pets']['Insert'];

// INCOMPLETE: more fields to be added when confirmed as required
export type AnimalType = {
  id?: BigInteger;
  name: string;
  species: string;
  breed: string;
  weight: string;
  client_id?: BigInteger;
};
export type EditableAnimalType = Omit<AnimalType, 'id' | 'client_id'>;

export type ServiceRequestTypeExample = Database['public']['Tables']['service_requests']['Insert'];

// INCOMPLETE: more fields to be added when confirmed as required
export type RequestType = {
  id?: BigInteger;
  client_id?: BigInteger;
  animal_id: BigInteger;
  service_category: string;
  priority: string;
  source: string;
  description: string;
  status: string;
  staff_id: BigInteger;
};
// TODO use lookup with assigned_to
export type EditableRequestType = Omit<RequestType, 'id' | 'animal_id' | 'staff_id'> & { assigned_to: string };
