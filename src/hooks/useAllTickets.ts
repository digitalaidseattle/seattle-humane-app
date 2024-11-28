import * as DataService from '@services/DataService';
import useSWR from 'swr';

export default function useAllTickets() {
  const {
    data, isLoading, isValidating,
  } = useSWR(
    'dataservice/alltickets',
    async () => DataService.getServiceRequestSummary(),
    { refreshInterval: 30000 }, // refresh every 30 seconds
  );

  return {
    data: data ?? [], isLoading, isValidating,
  };
}
