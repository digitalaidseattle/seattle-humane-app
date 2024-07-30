import { ServiceRequestType } from '@types';
import { useEffect, useState } from 'react';
import * as DataService from '@services/DataService';
import { useUser } from '@context/usercontext';

export default function useAssignedTickets() {
  const { user } = useUser();
  const [tickets, setTickets] = useState<ServiceRequestType[]>([]);

  useEffect(() => {
    if (!user) return;
    const getTickets = async () => {
      const data = await DataService.getAssignedTickets(user.id);
      setTickets(data);
    };
    getTickets();
  }, [user]);

  return tickets;
}
