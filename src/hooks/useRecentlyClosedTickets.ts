import useAllTickets from '@hooks/useAllTickets';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants, TicketStatus } from 'src/constants';
import useSWR from 'swr';

export default function useRecentlyClosedTickets() {
  const { data: tickets, isLoading: loadingAllTickets, isValidating } = useAllTickets();
  const { data: statuses, isLoading: loadingAppConstants } = useAppConstants(AppConstants.Status);

  const { data, isLoading: loadingRecentlyClosedTickets } = useSWR(
    () => (!loadingAllTickets && !isValidating && !loadingAppConstants) && 'dataService/recentlyClosedTickets',
    () => {
      const { id: closed } = statuses.find(({ value }) => value === TicketStatus.Closed);
      const recentlyClosedTickets = tickets
        .filter((ticket) => ticket.status === closed)
        .sort((a, b) => new Date(b.modified_at).valueOf() - new Date(a.modified_at).valueOf());
      return recentlyClosedTickets ?? [];
    },
    { refreshInterval: 30000 }, // refresh every 30 seconds
  );
  return {
    data,
    isLoading: loadingAllTickets || loadingRecentlyClosedTickets,
  };
}
