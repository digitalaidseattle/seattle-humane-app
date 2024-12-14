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
  );
  return {
    data: data ?? [],
    isLoading: loadingAllTickets || loadingMyTickets,
  };
}
