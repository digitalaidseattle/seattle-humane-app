import '@testing-library/jest-dom';
import {
  render, screen, renderHook, waitFor,
} from '@testing-library/react';
import TicketsTable from '@components/TicketsTable';
import type { ServiceRequestSummary } from '@types';

import { recentCases } from '@hooks/__mocks__/useRecentTickets';
import useRecentTickets from '@hooks/useRecentTickets';
import * as DataService from '@services/DataService';

jest.mock('@services/DataService');
const mockedDataService = jest.mocked(DataService);

beforeAll(() => {
  // Setup mock DataService
  mockedDataService.getServiceRequestSummary
    .mockImplementation(async () => recentCases.map((ticket) => ({
      ...ticket,
      client: ticket.client_id,
      pet: ticket.pet_id,
      team_member: ticket.team_member_id,
    })));
});

export interface TicketsTableProps {
  items: ServiceRequestSummary[]
}

describe('TicketTable Headers', () => {
  it('Checks Headers Presence', async () => {
    //* Act
    const { result } = renderHook(useRecentTickets);
    //* Assert
    render(<TicketsTable items={result.current} />);

    await waitFor(() => {
      // Grabs Elements
      const dateHeader = screen.getAllByText('Date');
      const descriptionHeader = screen.getAllByText('Description');
      const clientHeader = screen.getAllByText('Owner');
      const teamMemberHeader = screen.getAllByText('Team member');

      expect(result.current).toEqual(recentCases);
      expect(dateHeader[0]).toBeInTheDocument();
      expect(descriptionHeader[0]).toBeInTheDocument();
      expect(clientHeader[0]).toBeInTheDocument();
      expect(teamMemberHeader[0]).toBeInTheDocument();
    });
  });
});

jest.mock('next/link', () => ({ children }) => children);

describe('TicketsTable', () => {
  const items: ServiceRequestSummary[] = [
    {
      id: '1',
      team_member: 'John Doe',
      description: 'Cleaning service',
      created_at: '2023-05-01T12:00:00Z',
      pet: 'Sparky',
      client: 'Alice Smith',
    },
    {
      id: '2',
      team_member: 'Sarah Lee',
      description: 'Grooming service',
      created_at: '2023-04-15T10:30:00Z',
      pet: 'Buddy',
      client: 'Bob Johnson',
    },
  ];

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
    expect(screen.getByText('Sparky')).toBeInTheDocument();
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('Buddy')).toBeInTheDocument();
    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
  });

  it('renders description correctly', () => {
    render(<TicketsTable items={items} />);
    expect(screen.getByText('Cleaning service')).toBeInTheDocument();
    expect(screen.getByText('Grooming service')).toBeInTheDocument();
  });

  it('renders created_at date correctly', () => {
    render(<TicketsTable items={items} />);
    expect(screen.getByText('05/01/2023')).toBeInTheDocument();
    expect(screen.getByText('04/15/2023')).toBeInTheDocument();
  });

  it('renders team member correctly', () => {
    render(<TicketsTable items={items} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Sarah Lee')).toBeInTheDocument();
  });

  it('renders empty message when no items', () => {
    render(<TicketsTable items={[]} />);
    expect(screen.getByText('No data found.')).toBeInTheDocument();
  });
});
