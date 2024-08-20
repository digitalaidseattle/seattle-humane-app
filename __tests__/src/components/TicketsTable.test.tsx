import '@testing-library/jest-dom';
import {
  render, screen, renderHook, waitFor, fireEvent,
} from '@testing-library/react';
import TicketsTable from '@components/TicketsTable';
import type { ServiceRequestSummary } from '@types';

import { recentCases } from '@hooks/__mocks__/useRecentTickets';
import useRecentTickets from '@hooks/useRecentTickets';
import * as DataService from '@services/DataService';

jest.mock('@services/DataService');
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

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
      urgent: false,
    },
    {
      id: '2',
      team_member: 'Sarah Lee',
      description: 'Grooming service',
      created_at: '2023-04-15T10:30:00Z',
      pet: 'Buddy',
      client: 'Bob Johnson',
      urgent: true,
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

  it('renders Urgent on table if a case is Urgent', () => {
    render(<TicketsTable items={[]} />);
    expect(screen.getByText('Urgent')).toBeInTheDocument();
  });

  const mockItems = [
    {
      id: '1',
      pet: 'Dog',
      urgent: true,
      description: 'Annual checkup',
      created_at: '2023-05-01T12:00:00Z',
      team_member: 'John',
      client: 'Client 1',
      category: 'Checkup',
    },
    {
      id: '2',
      pet: 'Cat',
      urgent: false,
      description: 'Rabies shot',
      created_at: '2023-05-02T12:00:00Z',
      team_member: 'Jane',
      client: 'Client 2',
      category: 'Surgery',
    },
    {
      id: '3',
      pet: 'Bird',
      urgent: false,
      description: 'Wing repair',
      created_at: '2023-05-03T12:00:00Z',
      team_member: 'Bob',
      client: 'Client 3',
      category: 'Vaccination',
    },
  ];

  it('should sort the table when column headers are clicked', () => {
    render(<TicketsTable items={mockItems} />);

    // Test sorting by Owner (pet field)
    const ownerHeader = screen.getByText('Owner');
    fireEvent.click(ownerHeader);

    const petRows = screen.getAllByRole('row');
    expect(petRows[1]).toHaveTextContent('Bird');
    expect(petRows[2]).toHaveTextContent('Cat');
    expect(petRows[3]).toHaveTextContent('Dog');

    // Test sorting by Urgent
    const urgentColumn = screen.getAllByText('Urgent');
    fireEvent.click(urgentColumn[0]);

    const urgentRows = screen.getAllByRole('row');
    expect(urgentRows[1]).toHaveTextContent('Urgent');

    // Test sorting by Category
    const categoryHeader = screen.getByText('Category');
    fireEvent.click(categoryHeader);

    const categoryRows = screen.getAllByRole('row');
    expect(categoryRows[1]).toHaveTextContent('Checkup');
    expect(categoryRows[2]).toHaveTextContent('Surgery');
    expect(categoryRows[3]).toHaveTextContent('Vaccination');

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
