// TODO Remove this sprint demo component
import useRecentTickets from '@hooks/useRecentTickets';
import TicketsTable from '@components/TicketsTable';

export default function RecentTickets() {
  // TODO hookup deep link to ticket dialog on click
  const tickets = useRecentTickets();
  return (
    <TicketsTable items={tickets} />
  );
}
