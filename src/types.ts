import { Database, Tables } from '../supabase/database.types';

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

export type ServiceRequestSummary = Pick<ServiceRequestType, 'id' | 'description' | 'created_at' | 'urgent'> &
{ client: ClientType['first_name'] } &
{ pet: AnimalType['name'] } &
{ team_member: TeamMemberType['first_name'] };

export type AppConstantType = Tables<'app_constants'>;

export type TeamMemberType = Tables<'team_members'>;

// FIXME should these types be here? It makes more sense for them
// To be in the data service. Are we just putting all types here?
export type TableQueryModel = {
    page: number,
    pageSize: number,
    sortField: string,
    sortDirection: string,
};

export type PageInfo<T> = {
    totalRowCount: number,
    rows: T[],
};
