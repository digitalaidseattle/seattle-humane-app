import * as DataService from '@services/DataService';
import { ALL_TICKETS_SWR_KEY } from 'src/constants';
import useSWR from 'swr';

export default function useAllTickets() {
  const {
    data, isLoading, isValidating,
  } = useSWR(
    ALL_TICKETS_SWR_KEY,
    async () => DataService.getServiceRequestSummary(),
    { refreshInterval: 10000 },
  );

  return {
    data: data ?? [],
    isLoading: !data && isLoading,
    isValidating: !data && isValidating,
  };
}
