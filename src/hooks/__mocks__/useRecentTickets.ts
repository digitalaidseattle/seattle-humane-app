import type { ServiceRequestType } from '@types';
import { mockTicket } from '@hooks/__mocks__/useTicketById';

export const recentTickets = [
  mockTicket,
  { ...mockTicket, id: '147xyz' },
];
const useRecentTickets: (id: string) => ServiceRequestType[] = jest.fn(() => recentTickets);

export default useRecentTickets;
