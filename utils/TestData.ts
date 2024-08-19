import { faker } from '@faker-js/faker';
import { MockAppConstants } from '@hooks/__mocks__/useAppConstants';
import {
  TeamMemberType, ClientType, AnimalType, ServiceRequestType,
  ServiceRequestSummary,
} from '@types';

// #region Create mock data
faker.seed(123);
const {
  person, internet, phone, location,
  date, string, number, lorem,
  animal, datatype: { boolean },
} = faker;
export const mockTeamMembers: TeamMemberType[] = Array.from({ length: 10 }, () => ({
  id: string.uuid(),
  first_name: person.firstName(),
  last_name: person.lastName(),
  email: internet.email(),
  created_at: date.recent().toString(),
}));
export const mockTeamMember1 = mockTeamMembers[0];
export const mockTeamMember2 = mockTeamMembers[1];
export const mockTeamMember3 = mockTeamMembers[2];
export const mockTeamMemberOptions = [mockTeamMember1, mockTeamMember2, mockTeamMember3];

const genMockClient: () => ClientType = () => ({
  id: string.uuid(),
  first_name: person.firstName(),
  last_name: person.lastName(),
  email: internet.email(),
  phone: phone.number(),
  zip_code: location.zipCode(),
});
export const mockClients = Array(5).fill(null).map(() => genMockClient());
export const [mockClient, mockClient2, mockClient3] = mockClients;

const genMockPet: () => AnimalType = () => ({
  id: string.uuid(),
  client_id: mockClient.id,
  name: person.fullName(),
  age: number.int({ min: 1, max: 20 }),
  weight: number.int({ min: 1, max: 200 }),
  species: animal.type(),
});
export const mockPets = Array(5).fill(null).map(() => genMockPet());
export const [mockPet, mockPet2, mockPet3] = mockPets;

const genMockTicket: (idx: number) => ServiceRequestType = (idx: number) => ({
  id: string.uuid(),
  client_id: mockClients[idx % mockClients.length].id,
  pet_id: mockPets[idx % mockPets.length].id,
  service_category: MockAppConstants.category[0].value,
  request_source: MockAppConstants.source[0].value,
  status: MockAppConstants.status[idx % MockAppConstants.status.length].id,
  team_member_id: mockTeamMembers[idx % mockTeamMembers.length].id,
  description: lorem.sentence(),
  created_at: date.recent().toISOString(),
  urgent: boolean({ probability: 0.5 }),
  modified_at: date.recent().toISOString(),
});
export const mockTickets = Array(5).fill(null).map((_, idx) => genMockTicket(idx));
export const [mockTicket] = mockTickets;
// #endregion

const clientIdMap = new Map<string, ClientType>();
mockClients.forEach((client) => clientIdMap.set(client.id, client));

const animalIdMap = new Map<string, AnimalType>();
mockPets.forEach((pet) => animalIdMap.set(pet.id, pet));

const teamMemberIdMap = new Map<string, TeamMemberType>();
mockTeamMembers.forEach((teamMember) => teamMemberIdMap.set(teamMember.id, teamMember));

export const testGetServiceRequestSummaryFromTicket = (t: ServiceRequestType) => ({
  id: t.id,
  description: t.description,
  created_at: t.created_at,
  client: clientIdMap.get(t.client_id).first_name,
  pet: animalIdMap.get(t.pet_id).name,
  team_member: {
    first_name: teamMemberIdMap.get(t.team_member_id).first_name,
    email: teamMemberIdMap.get(t.team_member_id).email,
  },
  urgent: t.urgent,
  status: t.status,
  modified_at: t.modified_at,
}) as ServiceRequestSummary;

export const mockTicketsThisWeek = mockTickets.filter((t) => {
  const ticketDate = new Date(t.created_at);
  const dateDiff = new Date('2024-01-01T00:00:00.000Z').valueOf() - ticketDate.valueOf();
  return dateDiff < 7 * 24 * 60 * 60 * 1000;
});

export const mockServiceRequestSummaries = mockTickets
  .map((t) => testGetServiceRequestSummaryFromTicket(t));
