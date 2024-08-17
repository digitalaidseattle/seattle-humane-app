import '@testing-library/jest-dom';
import {
  render, screen, renderHook, waitFor,
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
    render(<TicketsTable items={result.current} />);

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
});
