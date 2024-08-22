import type { ServiceRequestSummary } from '@types';
import { getTicketsThisWeek } from '@services/__mocks__/DataService';

const useTicketsThisWeek: () => ServiceRequestSummary[] = getTicketsThisWeek;

export default useTicketsThisWeek;
