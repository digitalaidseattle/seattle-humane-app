import { useMemo } from 'react';
import * as DataService from '@services/DataService';
import useSWR from 'swr';

export default function useAllTickets() {
  const {
    data: fetchedData, isLoading, isValidating,
  } = useSWR(
    'dataservice/alltickets',
    async () => DataService.getServiceRequestSummary(),
    { refreshInterval: 10000 },
  );

  const data = useMemo(() => fetchedData ?? [], [fetchedData]);

  return {
    data, isLoading, isValidating,
  };
}
