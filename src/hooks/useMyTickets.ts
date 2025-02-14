import { useUser } from '@context/usercontext';
import useAllTickets from '@hooks/useAllTickets';

export default function useMyTickets() {
  const {
    data: tickets, isLoading: loadingAllTickets,
  } = useAllTickets();
  const { user } = useUser();
  const data = tickets.filter((ticket) => ticket.team_member.email === user.email);

  return {
    data: data ?? [],
    isLoading: loadingAllTickets,
  };
}
