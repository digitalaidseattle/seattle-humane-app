import useAllTickets from '@hooks/useAllTickets';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants, TicketStatus } from 'src/constants';
import useSWR from 'swr';

export default function useRecentlyClosedTickets() {
  const { data: tickets, isLoading: loadingAllTickets } = useAllTickets();
  const statuses = useAppConstants(AppConstants.Status);

  const { data, mutate, isLoading: loadingRecentlyClosedTickets } = useSWR(
    () => !loadingAllTickets && 'dataService/recentlyClosedTickets',
    () => {
      const { id: closed } = statuses.find(({ value }) => value === TicketStatus.Closed);
      const recentlyClosedTickets = tickets
        .filter((ticket) => ticket.status === closed)
        .sort((a, b) => new Date(a.modified_at).valueOf() - new Date(b.modified_at).valueOf());
      return recentlyClosedTickets ?? [];
    },
  );
  return {
    data,
    isLoading: loadingAllTickets || loadingRecentlyClosedTickets,
    refresh: () => mutate(),
  };
}
