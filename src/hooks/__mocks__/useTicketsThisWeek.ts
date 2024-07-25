import type { ServiceRequestType } from '@types';
import { mockTicket } from '@hooks/__mocks__/useTicketById';
import { daysAgo } from '@utils/timeUtils';

export const mockTicketsThisWeek: ServiceRequestType[] = [
  {
    ...mockTicket,
    id: '1',
    created_at: new Date(daysAgo(1)).toISOString(),
  },
  {
    ...mockTicket,
    id: '2',
    created_at: new Date(daysAgo(3)).toISOString(),
  },
  {
    ...mockTicket,
    id: '3',
    created_at: new Date(daysAgo(3)).toISOString(),
  },
  {
    ...mockTicket,
    id: '100',
    created_at: new Date(daysAgo(10)).toISOString(),
  },
];

const useTicketsThisWeek: () => ServiceRequestType[] = jest.fn(
  () => mockTicketsThisWeek,
);

export default useTicketsThisWeek;
