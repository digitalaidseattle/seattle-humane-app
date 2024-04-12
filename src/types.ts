import { Database } from '../supabase/database.types';

// MAIN DATA TYPES
// Current approach is to keep Domain models and Database models the same. If/when
// they diverge, we can create separate types for each and use a mapping function
// ID's are optional as they are not known until the data is persisted in DB

// INCOMPLETE: more fields to be added when confirmed as required

// EXAMPLE of Client type as imported from supabase;
export type ClientTypeExample = Database['public']['Tables']['clients']['Insert'];

export type ClientType = {
  id?: BigInteger;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  postal_code: string;
  previously_used: string;
};
export type EditableClientInfo = Omit<ClientType, 'id'>;

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

export type TeamMember = {
  id: BigInteger;
  email: string;
  last_name: string;
  first_name: string;
};

// INCOMPLETE: more fields to be added when confirmed as required
export type RequestType = {
  id?: BigInteger;
  client_id?: BigInteger;
  animal_id: BigInteger;
  service_category: string;
  service_category_id: string;
  priority: string;
  source: string;
  request_source_id: string
  description: string;
  status: string;
  staff_id: BigInteger;
  team_member_id: string;
  team_members: TeamMember;
};
// TODO use lookup with assigned_to
export type EditableRequestType = Omit<RequestType, 'id' | 'animal_id' | 'staff_id'> & { assigned_to: string };
