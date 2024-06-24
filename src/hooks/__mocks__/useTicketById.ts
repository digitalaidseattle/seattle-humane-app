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
const useTicketById: (id: string) => UseTicketByIdState = jest.fn(() => ({
  ticket: mockTicket,
  client: mockClient,
  animal: mockAnimal,
}));

export default useTicketById;
