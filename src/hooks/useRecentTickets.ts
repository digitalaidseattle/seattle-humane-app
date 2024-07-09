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
      const data = await ClientService.getServiceRequestSummary(
        {
          // TODO this needs to use real info
          page: 0,
          pageSize: 5,
          sortField: 'created_at',
          sortDirection: 'asc',
        },
      );
      setTickets(data.rows);
    };
    getTickets();
  }, [params]);

  return tickets;
}
