import { data } from '@hooks/__mocks__/useAppConstants';
import { john } from '@hooks/__mocks__/useTeamMembers';
import type { AnimalType, ClientType, ServiceRequestType } from '@types';
import type { UseTicketByIdState } from '@hooks/useTicketById';

export const mockClient: ClientType = {
  id: '456def',
  first_name: 'John',
  last_name: 'Smith',
  email: 'j.smith@test.openseattle.org',
  phone: '555-555-5555',
  zip_code: '12345',
};
export const mockAnimal: AnimalType = {
  id: '789ghi',
  client_id: mockClient.id,
  name: 'Sparky',
  age: 5,
  weight: 10,
  species: data.species[0].value,
};
export const mockTicket: ServiceRequestType = {
  id: '123abc',
  client_id: mockClient.id,
  pet_id: mockAnimal.id,
  service_category: data.category[0].value,
  request_source: data.source[0].value,
  status: data.status[0].value,
  team_member_id: john.id,
  description: 'Cleaning service',
  created_at: '',
};
export const mockSummary: ServiceRequestType = {
  id: '123abc',
  client_id: mockClient.id,
  pet_id: mockAnimal.id,
  service_category_id: data.category[0].id,
  request_source_id: data.source[0].id,
  team_member_id: john.id,
  log_id: '',
  description: 'Cleaning service',
  created_at: '',
  client: mockClient.id,
  pet: mockAnimal.id,
  team_member: john.id,
};
const useTicketById: (id: string) => UseTicketByIdState = jest.fn(() => ({
  ticket: mockTicket,
  client: mockClient,
  animal: mockAnimal,
}));

export default useTicketById;
