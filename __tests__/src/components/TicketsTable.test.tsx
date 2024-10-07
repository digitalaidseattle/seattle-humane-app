import '@testing-library/jest-dom';
import {
  render, screen, renderHook, waitFor, within,
  getByTestId,
  fireEvent, act
} from '@testing-library/react';
import TicketsTable from '@components/TicketsTable/TicketsTable';
import type { ServiceRequestSummary } from '@types';
import useAllTickets from '@hooks/useAllTickets';
import { mockServiceRequestSummaries, mockTeamMember1, mockTeamMember2 } from '@utils/TestData';
import { HeaderTemplate } from '@components/TicketsTable/Templates';
import { useState } from 'react';
import useAppConstants from '@hooks/useAppConstants';
import { MockAppConstants } from '@hooks/__mocks__/useAppConstants';
import { AppConstants } from 'src/constants';

jest.mock('@services/DataService');

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@hooks/useAppConstants', jest.fn);
jest.mock('@hooks/useTeamMembersAll', () => jest.fn);
const useAppConstantsMock = jest.mocked(useAppConstants);

beforeEach(() => {
  jest.clearAllMocks();
  useAppConstantsMock.mockImplementation((type) => ({
    data: MockAppConstants[type] || [], isLoading: false
  }));
});

jest.mock('next/link', () => ({ children }) => children);

export interface TicketsTableProps {
  items: ServiceRequestSummary[]
}

describe('TicketsTable', () => {
  const items = mockServiceRequestSummaries;
  const row = items[0];
  const row2 = items[0];
  const exampleCustomRow = {
    id: "19f34b65-a49f-4e0f-aa80-5c93511a0bea",
    created_at: "2024-10-06T04:50:38.388Z",
    service_category: "pet_fostering",
    client: {
      first_name: "Terrill",
      last_name: "Bosco",
    },
    pet: {
      name: "Nichole Padberg",
      species: "cat",
    },
    team_member: {
      first_name: "Lonny",
      last_name: "Kiehn",
      email: "Aron.Rath@gmail.com",
    },
    urgent: false,
    status: "open-id",
    modified_at: "2024-10-06T08:46:46.532Z",
  };
  const Labels = {
    globalFilterOverlay: 'global filter menu overlay',
    globalFilterMenuButton: 'global filter menu',
  }
  function loadTable(tableItems = items) {
    render(
      <TicketsTable items={tableItems} />
    );
  }

  function filteredTable() {
    loadTable();

  }

  it('renders table headers correctly', () => {
    loadTable();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Team member')).toBeInTheDocument();
  });

  const mockDefaultExternalFilters = {
    global_urgent: { value: null },
    owner_and_pet: { value: '' },
    global_species: { value: [], filterOptions: [] },
  };
  const mockDefaultFilters = {
    global: { value: null, matchMode: null },
    service_category: { value: null, matchMode: null },
    'team_member.email': { value: null, matchMode: null },
    created_at: { value: null, matchMode: null },
    'client.first_name': { value: '', matchMode: null },
  };

  it('renders global filter controls in header', () => {
    loadTable();
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByLabelText(Labels.globalFilterMenuButton)).toBeInTheDocument();
  });

  it('global filter overlay panel visibility', () => {
    loadTable();
    expect(screen.queryByLabelText(Labels.globalFilterOverlay)).toBe(null);
    const button = screen.getByLabelText(Labels.globalFilterMenuButton);
    fireEvent.click(button);
    expect(screen.getAllByLabelText(Labels.globalFilterOverlay)[0]).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText(Labels.globalFilterMenuButton));
    expect(screen.getAllByLabelText(Labels.globalFilterOverlay)[0]).not.toBeVisible();
  });

  it('global filter controls visibility', () => {
    loadTable();
    const filterButton = screen.getByLabelText(Labels.globalFilterMenuButton);
    expect(filterButton).toBeInTheDocument();
    fireEvent.click(filterButton);
    const globalFilters = ['Urgent', ...MockAppConstants.species.map(i => i.label)];
    globalFilters.forEach(option => {
      expect(screen.getAllByLabelText(option)[0]).toBeInTheDocument();
    });
  });

  // it('should clear all filters when reset button is clicked', () => {
  //   const dirtyInternalFilters = { ...mockDefaultFilters, }
  //   const resetHandler = jest.fn();
  //   const setFilters = jest.fn();
  //   // render(<HeaderTemplate resetHandler={resetHandler} filtersActive={true} filters={filters} setFilters={setFilters} />);

  //   fireEvent.click(screen.getByText('Clear'));

  //   expect(resetHandler).toHaveBeenCalled();
  // });

  it('renders owner and pet names correctly', () => {
    loadTable([row]);
    const petNameDiv = screen.getByLabelText('pet-name');
    const clientNameDiv = screen.getByLabelText('client-name');
    expect(petNameDiv).toBeInTheDocument();
    expect(petNameDiv).toHaveTextContent(row.pet.name);
    expect(clientNameDiv).toBeInTheDocument();
    expect(clientNameDiv).toHaveTextContent(row.client.first_name);
  });

  it('renders category correctly', () => {
    loadTable([row]);
    expect(screen.getByText(row.service_category)).toBeInTheDocument();
  });

  it('renders created_at date correctly', () => {
    loadTable();
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
    loadTable();
    expect(screen.getByText(row.team_member.first_name)).toBeInTheDocument();
    expect(screen.getByText(row2.team_member.first_name)).toBeInTheDocument();
  });

  it('renders empty message when no items', () => {
    loadTable([]);
    expect(screen.getByText('No data found.')).toBeInTheDocument();
  });

  it('renders urgent tickets correctly', () => {
    loadTable([{ ...row, urgent: true }]);
    const urgentIcon = screen.getByLabelText('urgent');
    expect(urgentIcon).toBeInTheDocument();
    expect(urgentIcon).toHaveClass('pi pi-exclamation-triangle');
  });
});
