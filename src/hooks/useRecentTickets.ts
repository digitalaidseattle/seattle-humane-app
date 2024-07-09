// TODO Remove this sprint Demo hook
import { ServiceRequestSummary } from '@types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ClientService from 'src/services/ClientService';

export default function useRecentTickets() {
  const [tickets, setTickets] = useState<(ServiceRequestSummary)[]>([]);
  // Hack:  using url change to trigger to get recent tickets
  const params = useSearchParams();
  useEffect(() => {
    const getTickets = async () => {
      const data = await ClientService.getServiceRequestSummary();
      setTickets(data);
    };
    getTickets();
  }, [params]);

  return tickets;
}
