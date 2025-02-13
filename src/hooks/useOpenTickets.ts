import useAllTickets from '@hooks/useAllTickets';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants, TicketStatus } from 'src/constants';

export default function useOpenTickets() {
  const { data: tickets, isLoading: loadingAllTickets } = useAllTickets();
  const { data: statuses, isLoading: loadingAppConstants } = useAppConstants(AppConstants.Status);

  const { id: open = null } = statuses.find(({ value }) => value === TicketStatus.Open) ?? {};
  const openTickets = tickets
    .filter((ticket) => ticket.status === open);

  return {
    data: openTickets,
    isLoading: loadingAllTickets || loadingAppConstants,
  };
}
