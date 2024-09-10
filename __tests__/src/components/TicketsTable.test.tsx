import '@testing-library/jest-dom';
import {
  render, screen, renderHook, waitFor, fireEvent,
} from '@testing-library/react';
import TicketsTable from '@components/TicketsTable';
import type { ServiceRequestSummary } from '@types';

import useAllTickets from '@hooks/useAllTickets';
import { mockServiceRequestSummaries } from '@utils/TestData';

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
    render(<TicketsTable items={[]} />);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });

  it('renders Urgent on table if a case is Urgent', () => {
    render(<TicketsTable items={[]} />);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });

  it('should sort the table when column headers are clicked', () => {
    const mockItemsSort: ServiceRequestSummary[] = [
      {
        id: '1',
        pet: 'Dog',
        urgent: true,
        description: 'Annual checkup',
        created_at: '2023-05-01T12:00:00Z',
        team_member: { first_name: 'John', email: 'john@example.com' },
        client: 'Client 1',
        status: 'Open',
        modified_at: '2023-05-01T12:00:00Z',
      },
      {
        id: '2',
        pet: 'Cat',
        urgent: false,
        description: 'Rabies shot',
        created_at: '2023-05-02T12:00:00Z',
        team_member: { first_name: 'Jane', email: 'jane@example.com' },
        client: 'Client 2',
        status: 'Open',
        modified_at: '2023-05-02T12:00:00Z',
      },
      {
        id: '3',
        pet: 'Bird',
        urgent: false,
        description: 'Wing repair',
        created_at: '2023-05-03T12:00:00Z',
        team_member: { first_name: 'Bob', email: 'bob@example.com' },
        client: 'Client 3',
        status: 'Open',
        modified_at: '2023-05-03T12:00:00Z',
      },
    ];

    render(<TicketsTable items={mockItemsSort} />);

    // Test sorting by Owner (pet field)
    // const ownerHeader = screen.getByText('Owner');
    // fireEvent.click(ownerHeader);

    // const petRows = screen.getAllByRole('row');
    // expect(petRows[1]).toHaveTextContent('Bird');
    // expect(petRows[2]).toHaveTextContent('Cat');
    // expect(petRows[3]).toHaveTextContent('Dog');

    // Test sorting by Urgent
    const urgentColumn = screen.getAllByText('Urgent');
    fireEvent.click(urgentColumn[0]);

    const urgentRows = screen.getAllByRole('row');
    expect(urgentRows[1]).toHaveTextContent('Urgent');

    // Test sorting by Category
    const categoryHeader = screen.getByText('Category');
    fireEvent.click(categoryHeader);

    const categoryRows = screen.getAllByRole('row');
    expect(categoryRows[1]).toHaveTextContent('Annual checkup');
    expect(categoryRows[2]).toHaveTextContent('Rabies shot');
    expect(categoryRows[3]).toHaveTextContent('Wing repair');

    // Test sorting by Date
    const dateHeader = screen.getByText('Date');
    fireEvent.click(dateHeader);

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('05/01/2023');
    expect(rows[2]).toHaveTextContent('05/02/2023');
    expect(rows[3]).toHaveTextContent('05/03/2023');

    // Test sorting by Team member
    const teamMemberHeader = screen.getByText('Team member');
    fireEvent.click(teamMemberHeader);

    const teamRows = screen.getAllByRole('row');
    expect(teamRows[1]).toHaveTextContent('Bob');
    expect(teamRows[2]).toHaveTextContent('Jane');
    expect(teamRows[3]).toHaveTextContent('John');
  });
});
