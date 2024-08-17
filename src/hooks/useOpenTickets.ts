import useAllTickets from '@hooks/useAllTickets';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants, TicketStatus } from 'src/constants';
import useSWR from 'swr';

export default function useOpenTickets() {
  const { data: tickets, isLoading: loadingAllTickets } = useAllTickets();
  const { data: statuses, isLoading: loadingAppConstants } = useAppConstants(AppConstants.Status);

  const { data, mutate, isLoading: loadingOpenTickets } = useSWR(
    () => (!loadingAllTickets && !loadingAppConstants) && 'dataService/openTickets',
    () => {
      const { id: open } = statuses.find(({ value }) => value === TicketStatus.Open);
      const openTickets = tickets
        .filter((ticket) => ticket.status === open);
      return openTickets ?? [];
    },
  );
  return {
    data,
    isLoading: loadingAllTickets || loadingOpenTickets,
    refresh: () => mutate(),
  };
}
