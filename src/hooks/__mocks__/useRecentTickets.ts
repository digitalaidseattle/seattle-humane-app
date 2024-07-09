import type { ServiceRequestType } from '@types';
import { mockTicket, mockSummary } from '@hooks/__mocks__/useTicketById';

export const recentTickets = [
  mockTicket,
  { ...mockTicket, id: '147xyz' },
];

export const recentCases = [
  {
    ...mockSummary,
    id: '147xyz',
  },
];
const useRecentTickets: (id: string) => ServiceRequestType[] = jest.fn(() => recentTickets);

export default useRecentTickets;
