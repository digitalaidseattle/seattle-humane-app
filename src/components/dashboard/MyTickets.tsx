import TicketsTable from '@components/TicketsTable';
import { useContext, useEffect, useState } from 'react';
import { TicketSummaryListContext } from '@context/dashboard/ticketSummaryListContext';
import type { ServiceRequestSummary } from '@types';
import { UserContext } from '@context/usercontext';

export default function MyTickets() {
  const tickets = useContext(TicketSummaryListContext);
  const [myTickets, setMyTickets] = useState<ServiceRequestSummary[]>([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    async function loadOpenTickets() {
      setMyTickets(tickets
        .filter((ticket) => ticket.team_member.email === user.email));
    }
    loadOpenTickets();
  }, [tickets, user]);

  return (
    <TicketsTable items={myTickets} />
  );
}
