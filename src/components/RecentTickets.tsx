// TODO Remove this sprint demo component
import useRecentTickets from '@hooks/useRecentTickets';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RecentTickets() {
  const pathname = usePathname();
  const tickets = useRecentTickets();
  return (
    <ul>
      {tickets.map(({ id, description, created_at }) => (
        <li key={id}>
          <Link href={`${pathname}?ticket=${id}`}>
            <em>{new Date(created_at).toLocaleDateString()}</em>
            <span className="ml-3 text-lg">{description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
