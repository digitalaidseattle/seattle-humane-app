import type { ServiceRequestSummary } from '@types';
import {
  mockAnimal, mockClient, mockTicket, mockSummary,
} from '@hooks/__mocks__/useTicketById';
import { mockTeamMember1 } from '@hooks/__mocks__/useTeamMembers';

const mockTicketSummary = {
  id: mockTicket.id,
  description: mockTicket.description,
  created_at: mockTicket.created_at,
  client: mockClient.first_name,
  pet: mockAnimal.name,
  team_member: mockTeamMember1.first_name,
};

export const recentTickets: ServiceRequestSummary[] = [
  mockTicketSummary,
  { ...mockTicketSummary, id: 'abc' },
];

export const recentCases = [
  {
    ...mockSummary,
    id: '147xyz',
  },
];
const useRecentTickets: (id: string) => ServiceRequestSummary[] = jest.fn(() => recentTickets);

export default useRecentTickets;
