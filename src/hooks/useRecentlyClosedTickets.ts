import useAllTickets from '@hooks/useAllTickets';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants, TicketStatus } from 'src/constants';

export default function useRecentlyClosedTickets() {
  const { data: tickets, isLoading: loadingAllTickets } = useAllTickets();
  const { data: statuses, isLoading: loadingAppConstants } = useAppConstants(AppConstants.Status);

  const { id: closed = null } = statuses.find(({ value }) => value === TicketStatus.Closed) ?? {};
  const recentlyClosedTickets = tickets
    .filter((ticket) => ticket.status === closed)
    .sort((a, b) => new Date(b.modified_at).valueOf() - new Date(a.modified_at).valueOf());

  return {
    data: recentlyClosedTickets,
    isLoading: loadingAllTickets || loadingAppConstants,
  };
}
