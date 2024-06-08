// TODO Remove this sprint Demo hook
import { ServiceRequestType } from '@types';
import { useEffect, useState } from 'react';
import ClientService from 'src/services/ClientService';

export default function useRecentTickets() {
  const [tickets, setTickets] = useState<ServiceRequestType[]>([]);

  useEffect(() => {
    const getTickets = async () => {
      const data = await ClientService.getRecentTickets();
      setTickets(data);
    };
    getTickets();
  }, []);

  return tickets;
}
