import { useUser } from '@context/usercontext';
import useAllTickets from '@hooks/useAllTickets';
import useSWR from 'swr';

export default function useMyTickets() {
  const {
    data: tickets, isLoading: loadingAllTickets, isValidating,
  } = useAllTickets();
  const { user } = useUser();

  const { data, isLoading: loadingMyTickets } = useSWR(
    () => (!loadingAllTickets && !isValidating) && 'dataService/myTickets',
    async () => tickets
      .filter((ticket) => ticket.team_member.email === user.email),
    { refreshInterval: 30000 }, // refresh every 30 seconds
  );
  return {
    data: data ?? [],
    isLoading: loadingAllTickets || loadingMyTickets,
  };
}
