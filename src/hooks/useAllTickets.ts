import { ServiceRequestSummary } from '@types';
import { useEffect, useState } from 'react';
import * as DataService from '@services/DataService';

export default function useAllTickets() {
  const [tickets, setTickets] = useState<(ServiceRequestSummary)[]>([]);
  useEffect(() => {
    const getTickets = async () => {
      const data = await DataService.getServiceRequestSummary();
      setTickets(data);
    };
    getTickets();
  }, []);

  return tickets;
}
