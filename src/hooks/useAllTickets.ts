import * as DataService from '@services/DataService';
import useSWR from 'swr';

export default function useAllTickets() {
  const {
    data, isLoading, isValidating,
  } = useSWR(
    'dataservice/alltickets',
    async () => DataService.getServiceRequestSummary(),
    { refreshInterval: 120000 }, // refresh every 2 minutes
  );

  return {
    data: data ?? [], isLoading, isValidating,
  };
}
