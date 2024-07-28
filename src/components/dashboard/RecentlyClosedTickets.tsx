import TicketsTable from '@components/TicketsTable';
import { useContext, useEffect, useState } from 'react';
import { TicketSummaryListContext } from '@context/dashboard/ticketSummaryListContext';
import { AppConstants, TicketStatus } from 'src/constants';
import useAppConstants from '@hooks/useAppConstants';
import type { ServiceRequestSummary } from '@types';

export default function AllOpenTickets() {
  const tickets = useContext(TicketSummaryListContext);
  const [recentlyClosed, setRecentlyClosed] = useState<ServiceRequestSummary[]>([]);
  const statuses = useAppConstants(AppConstants.Status);

  useEffect(() => {
    async function loadRecentlyClosed() {
      if (!statuses.length) return;
      const { id: closed } = statuses.find(({ value }) => value === TicketStatus.Closed);
      setRecentlyClosed(tickets
        .filter((ticket) => ticket.status === closed)
        .sort((a, b) => new Date(a.modified_at).valueOf() - new Date(b.modified_at).valueOf()));
    }
    loadRecentlyClosed();
  }, [tickets, statuses]);

  return (
    <TicketsTable items={recentlyClosed} />
  );
}
