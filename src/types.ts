import { Database, Tables } from '../supabase/database.types';

// INCOMPLETE: more fields to be added when confirmed as required

export type ClientSchema = Tables<'clients'>;
export type ClientSchemaInsert = Database['public']['Tables']['clients']['Insert'];

export type AnimalType = Tables<'pets'>;
export type AnimalSchemaInsert = Database['public']['Tables']['pets']['Insert'];

export type ServiceRequestSchema = Tables<'service_requests'>;
export type ServiceRequestSchemaInsert = Database['public']['Tables']['service_requests']['Insert'];
