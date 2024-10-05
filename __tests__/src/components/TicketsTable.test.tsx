import '@testing-library/jest-dom';
import {
  render, screen, renderHook, waitFor,
} from '@testing-library/react';
import TicketsTable from '@components/TicketsTable/TicketsTable';
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
      const categoryHeader = screen.getAllByText('Category');
      const clientHeader = screen.getAllByText('Name');
      const teamMemberHeader = screen.getAllByText('Team member');

      expect(dateHeader[0]).toBeInTheDocument();
      expect(categoryHeader[0]).toBeInTheDocument();
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
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Team member')).toBeInTheDocument();
  });

  it('renders owner and pet names correctly', () => {
    let customRow = [{
      ...items[0],
      pet: { name: 'bobby', species: 'dog' },
      client: { first_name: 'richard', last_name: 'richardson' },
    }];
    render(<TicketsTable items={customRow} />);
    const petNameDiv = screen.getByLabelText('pet-name');
    expect(petNameDiv).toBeInTheDocument();
    expect(petNameDiv).toHaveTextContent('bobby');
    expect(screen.getByText('richard richardson')).toBeInTheDocument();
  });

  it('renders category correctly', () => {
    render(<TicketsTable items={[{ ...items[0], service_category: 'vaccination' }]} />);
    expect(screen.getByText('vaccination')).toBeInTheDocument();
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

  it('renders urgent tickets correctly', () => {
    render(<TicketsTable items={[{ ...items[0], urgent: true }]} />);
    const urgentIcon = screen.getByLabelText('urgent');
    expect(urgentIcon).toBeInTheDocument();
    expect(urgentIcon).toHaveClass('pi pi-exclamation-triangle');
  });
});
