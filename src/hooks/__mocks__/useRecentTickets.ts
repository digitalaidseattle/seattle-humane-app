import type { ServiceRequestSummary } from '@types';
import { mockTicket, testGetServiceRequestSummaryFromTicket } from '@utils/TestData';

const mockServiceRequest = testGetServiceRequestSummaryFromTicket(mockTicket);
export const recentTickets: ServiceRequestSummary[] = [
  mockServiceRequest,
  { ...mockServiceRequest, id: 'abc' },
];

export const recentCases = [
  {
    ...mockServiceRequest,
    id: '147xyz',
  },
];
const useRecentTickets: (id: string) => ServiceRequestSummary[] = jest.fn(() => recentTickets);

export default useRecentTickets;
