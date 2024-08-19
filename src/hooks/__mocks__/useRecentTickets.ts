import type { ServiceRequestSummary } from '@types';
import { mockTicket, testGetServiceRequestSummaryFromTicket } from '@utils/TestData';

const mockServicreRequest = testGetServiceRequestSummaryFromTicket(mockTicket);
export const recentTickets: ServiceRequestSummary[] = [
  mockServicreRequest,
  { ...mockServicreRequest, id: 'abc' },
];

export const recentCases = [
  {
    ...mockServicreRequest,
    id: '147xyz',
  },
];
const useRecentTickets: (id: string) => ServiceRequestSummary[] = jest.fn(() => recentTickets);

export default useRecentTickets;
