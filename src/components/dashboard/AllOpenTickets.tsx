import TicketsTable from '@components/TicketsTable';
import { useContext, useEffect, useState } from 'react';
import { TicketSummaryListContext } from '@context/dashboard/ticketSummaryListContext';
import { AppConstants, TicketStatus } from 'src/constants';
import useAppConstants from '@hooks/useAppConstants';
import type { ServiceRequestSummary } from '@types';

export default function AllOpenTickets() {
  const tickets = useContext(TicketSummaryListContext);
  const [openTickets, setOpenTickets] = useState<ServiceRequestSummary[]>([]);
  const statuses = useAppConstants(AppConstants.Status);

  useEffect(() => {
    async function loadOpenTickets() {
      if (!statuses.length) return;
      const { id: open } = statuses.find(({ value }) => value === TicketStatus.Open);
      setOpenTickets(tickets
        .filter((ticket) => ticket.status === open));
    }
    loadOpenTickets();
  }, [tickets, statuses]);

  return (
    <TicketsTable items={openTickets} />
  );
}
