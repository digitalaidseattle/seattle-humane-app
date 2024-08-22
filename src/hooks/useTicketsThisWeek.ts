import { ServiceRequestType } from '@types';
import { useEffect, useState } from 'react';
import * as DataService from '@services/DataService';

export default function useTicketsThisWeek() {
  const [tickets, setTickets] = useState<ServiceRequestType[]>([]);

  useEffect(() => {
    const getTickets = async () => {
      const data = await DataService.getTicketsThisWeek();
      setTickets(data);
    };
    getTickets();
  }, []);

  return tickets;
}
