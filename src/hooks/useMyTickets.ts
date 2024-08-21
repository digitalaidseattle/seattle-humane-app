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
    async () => {
      const myTickets = tickets
        .filter((ticket) => ticket.team_member.email === user.email);
      return myTickets ?? [];
    },
  );
  return {
    data,
    isLoading: loadingAllTickets || loadingMyTickets,
  };
}
