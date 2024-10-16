import '@testing-library/jest-dom';
import {
  render, screen, renderHook, waitFor, fireEvent,
} from '@testing-library/react';
import TicketsTable from '@components/TicketsTable';
import type { ServiceRequestSummary } from '@types';

import useAllTickets from '@hooks/useAllTickets';
import { mockServiceRequestSummaries, mockItems} from '@utils/TestData';

jest.mock('@services/DataService');
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

export interface TicketsTableProps {
  items: ServiceRequestSummary[]
}

describe('TicketTable Headers', () => {
  it('Checks Headers Presence', async () => {
    //* Act
    const { result } = renderHook(useAllTickets);
    //* Assert
    render(<TicketsTable items={result.current.data} />);

    await waitFor(() => {
      // Grabs Elements
      const dateHeader = screen.getAllByText('Date');
      const descriptionHeader = screen.getAllByText('Description');
      const clientHeader = screen.getAllByText('Owner');
      const teamMemberHeader = screen.getAllByText('Team member');

      expect(dateHeader[0]).toBeInTheDocument();
      expect(descriptionHeader[0]).toBeInTheDocument();
      expect(clientHeader[0]).toBeInTheDocument();
      expect(teamMemberHeader[0]).toBeInTheDocument();
    });
  });
});

jest.mock('next/link', () => ({ children }) => children);

describe('TicketsTable', () => {
  const items = mockServiceRequestSummaries;
  const row = items[0];
  const row2 = items[0];
  it('renders table headers correctly', () => {
    render(<TicketsTable items={items} />);
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Team member')).toBeInTheDocument();
  });

  it('renders owner and pet names correctly', () => {
    render(<TicketsTable items={items} />);
    expect(screen.getByText(row.pet)).toBeInTheDocument();
    expect(screen.getByText(row.client)).toBeInTheDocument();
    expect(screen.getByText(row2.pet)).toBeInTheDocument();
    expect(screen.getByText(row2.client)).toBeInTheDocument();
  });

  it('renders description correctly', () => {
    render(<TicketsTable items={items} />);
    expect(screen.getByText(row.description)).toBeInTheDocument();
    expect(screen.getByText(row2.description)).toBeInTheDocument();
  });

  it('renders created_at date correctly', () => {
    render(<TicketsTable items={items} />);
    const [date] = screen.getAllByText(new Date(row.created_at).toLocaleDateString('en-US', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }));
    const [differentDate] = screen.getAllByText(new Date(items[items.length - 1].created_at).toLocaleDateString('en-US', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    }));
    expect(date).toBeInTheDocument();
    expect(differentDate).toBeInTheDocument();
  });

  it('renders team member correctly', () => {
    render(<TicketsTable items={items} />);
    expect(screen.getByText(row.team_member.first_name)).toBeInTheDocument();
    expect(screen.getByText(row2.team_member.first_name)).toBeInTheDocument();
  });

  it('renders empty message when no items', () => {
    render(<TicketsTable items={[]} />);
    expect(screen.getByText('No data found.')).toBeInTheDocument();
  });

  it('renders Urgent on table if a case is Urgent', () => {
    const urgentItem = { ...items[0], urgent: true };
    render(<TicketsTable items={[urgentItem]} />);
    const urgentCell = screen.getByRole('cell', { name: 'Urgent' });
    expect(urgentCell).toBeInTheDocument();
  });
});

describe('TicketsTable Sorting', () => {
  const items = mockServiceRequestSummaries;

  it('sorts tickets alphabetically by pet name', () => {
    render(<TicketsTable items={items} />);
    const ownerHeader = screen.getByText('Owner');
    fireEvent.click(ownerHeader);

    const petRows = screen.getAllByRole('row');
    expect(petRows[1]).toHaveTextContent('Edith Ryan');
    expect(petRows[2]).toHaveTextContent('Nichole Padberg');
    expect(petRows[3]).toHaveTextContent('Mercedes');
  });

  it('sorts tickets by urgency prioritizing urgent cases', () => {
    render(<TicketsTable items={items} />);
    const urgentColumn = screen.getAllByText('Urgent');
    fireEvent.click(urgentColumn[0]);

    const urgentRows = screen.getAllByRole('row');
    expect(urgentRows[1]).toHaveTextContent('Urgent');
  });

  it('sorts the categories of service alphabetically', () => {
    render(<TicketsTable items={items} />);
    const categoryHeader = screen.getByText('Category');
    fireEvent.click(categoryHeader);

    const categoryRows = screen.getAllByRole('row');
    expect(categoryRows[1]).toHaveTextContent('pet_fostering');
    expect(categoryRows[2]).toHaveTextContent('pet_fostering');
  });

  it('sorts tickets from oldest to newest', () => {
    render(<TicketsTable items={mockItems} />);
    const dateHeader = screen.getByText('Date');
    fireEvent.click(dateHeader);

    const rows = screen.getAllByRole('row');
    const dates = rows.slice(3).map((row) => (row as HTMLTableRowElement).cells[4].textContent); // assuming the date is the 4th cell    dates.push('9/9/2010'); // This will need to be removed, I was just making sure it broke correctly

    const sortedDates = [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    expect(dates).toEqual(sortedDates);
  });

  it('sorts team member alphabetically', () => {
    render(<TicketsTable items={items} />);
    const teamMemberHeader = screen.getByText('Team member');
    fireEvent.click(teamMemberHeader);

    const teamRows = screen.getAllByRole('row');
    expect(teamRows[1]).toHaveTextContent('Dylan');
    expect(teamRows[2]).toHaveTextContent('Fredy');
    expect(teamRows[3]).toHaveTextContent('Herta');
  });
});
