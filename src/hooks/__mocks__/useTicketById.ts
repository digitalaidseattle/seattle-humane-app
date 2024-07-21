import { faker } from '@faker-js/faker';
import { data } from '@hooks/__mocks__/useAppConstants';
import { mockTeamMember2 } from '@hooks/__mocks__/useTeamMembers';
import type { AnimalType, ClientType, ServiceRequestType } from '@types';
import type { UseTicketByIdState } from '@hooks/useTicketById';

faker.seed(123);
const {
  person, internet, phone, location,
  date, string, number, lorem,
  animal,
} = faker;
export const mockClient: ClientType = {
  id: string.uuid(),
  first_name: person.firstName(),
  last_name: person.lastName(),
  email: internet.email(),
  phone: phone.number(),
  zip_code: location.zipCode(),
};
export const mockAnimal: AnimalType = {
  id: string.uuid(),
  client_id: mockClient.id,
  name: person.fullName(),
  age: number.int({ min: 1, max: 20 }),
  weight: number.int({ min: 1, max: 200 }),
  species: animal.type(),
};
export const mockTicket: ServiceRequestType = {
  id: string.uuid(),
  client_id: mockClient.id,
  pet_id: mockAnimal.id,
  service_category: data.category[0].value,
  request_source: data.source[0].value,
  status: data.status[0].value,
  team_member_id: mockTeamMember2.id,
  description: lorem.sentence(),
  created_at: date.recent().toString(),
};
export const mockSummary: ServiceRequestType & {
  client: string, pet: string, team_member: string
} = {
  id: mockTicket.id,
  client_id: mockClient.id,
  pet_id: mockAnimal.id,
  service_category: data.category[0].value,
  request_source: data.source[0].value,
  status: data.status[0].value,
  team_member_id: mockTeamMember2.id,
  description: mockTicket.description,
  created_at: mockTicket.created_at,
  client: mockClient.id,
  pet: mockAnimal.id,
  team_member: mockTeamMember2.id,
};
const useTicketById: (id: string) => UseTicketByIdState = jest.fn(() => ({
  ticket: mockTicket,
  client: mockClient,
  animal: mockAnimal,
}));

export default useTicketById;
