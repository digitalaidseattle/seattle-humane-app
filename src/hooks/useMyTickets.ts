import { useUser } from '@context/usercontext';
import useAllTickets from '@hooks/useAllTickets';
import useSWR from 'swr';

export default function useMyTickets() {
  const {
    data: tickets, isLoading: loadingAllTickets, isValidating,
  } = useAllTickets();
  const { user } = useUser();

  const { data, isLoading: loadingMyTickets } = useSWR(
    () => (!loadingAllTickets && !isValidating) && 'dataservice/mytickets',
    async () => tickets
      .filter((ticket) => ticket.team_member.email === user.email),
    { refreshInterval: 120000 }, // refresh every 2 minutes
  );
  return {
    data: data ?? [],
    isLoading: loadingAllTickets || loadingMyTickets,
  };
}
