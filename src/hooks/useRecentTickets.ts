import { ServiceRequestSummary } from '@types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as DataService from '@services/DataService';

export default function useRecentTickets() {
  const [tickets, setTickets] = useState<(ServiceRequestSummary)[]>([]);
  // Hack:  using url change to trigger to get recent tickets
  const params = useSearchParams();
  useEffect(() => {
    const getTickets = async () => {
      const data = await DataService.getServiceRequestSummary();
      setTickets(data);
    };
    getTickets();
  }, [params]);

  return tickets;
}
