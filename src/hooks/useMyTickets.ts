import { UserContext } from '@context/usercontext';
import useAllTickets from '@hooks/useAllTickets';
import { useContext } from 'react';
import useSWR from 'swr';

export default function useMyTickets() {
  const { data: tickets, isLoading: loadingAllTickets } = useAllTickets();
  const { user } = useContext(UserContext);

  const { data, mutate, isLoading: loadingMyTickets } = useSWR(
    () => !loadingAllTickets && 'dataService/myTickets',
    async () => {
      const myTickets = tickets
        .filter((ticket) => ticket.team_member.email === user.email);
      return myTickets ?? [];
    },
  );
  return {
    data,
    isLoading: loadingAllTickets || loadingMyTickets,
    refresh: () => mutate(),
  };
}
