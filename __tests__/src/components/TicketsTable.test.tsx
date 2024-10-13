import '@testing-library/jest-dom';
import { render, screen, fireEvent, prettyDOM, renderHook, waitFor, act } from '@testing-library/react';
import TicketsTable from '@components/TicketsTable/TicketsTable';
import type { ServiceRequestSummary } from '@types';
import { mockServiceRequestSummaries } from '@utils/TestData';
import useAppConstants from '@hooks/useAppConstants';
import { MockAppConstants } from '@hooks/__mocks__/useAppConstants';
import userEvent from '@testing-library/user-event';
import useFilters, { defaultExternalFilters } from '@hooks/useFilters';
import React from 'react';

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
  function loadTable(tableItems = items) {
    render(
      <TicketsTable items={tableItems} loading={false} />
    );
  }

  it('renders table headers correctly', () => {
    loadTable();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Team member')).toBeInTheDocument();
  });

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

describe('TicketsTable filters', () => {
  const items = mockServiceRequestSummaries;
  const Labels = {
    globalFilterOverlay: 'global filter menu overlay',
    globalFilterMenuButton: 'global filter menu',
  }
  function loadTable(tableItems = items) {
    render(
      <TicketsTable items={tableItems} loading={false} />
    );
  }

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

  it('reset button clears all external filters', async () => {
    loadTable();
    // activate overlay
    const filterButton = screen.getByRole('button', { name: Labels.globalFilterMenuButton });

    expect(filterButton).toBeInTheDocument();
    fireEvent.click(filterButton);

    // find filter control checkbox
    const checkboxContainer = screen.getAllByText(/urgent/i)[0];

    expect(checkboxContainer).toBeInTheDocument();

    const checkbox = checkboxContainer.parentElement?.querySelector('[role="checkbox"]');
    expect(checkbox).toBeInTheDocument();

    // activate filter control checkbox
    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    // activate clear filters button
    const clearButton = screen.getByRole('button', { name: /clear/i });
    expect(clearButton).toBeInTheDocument();
    fireEvent.click(clearButton);

    // doulbe check state of filter control checkbox
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('should filter by urgent', () => {
    const noUrgents = items.map(element => {
      const item = { ...element, urgent: false };
      return item;
    });
    const expected = noUrgents.map(e => ({ ...e }))
    const client = { first_name: 'jonathan', last_name: 'jostar' }
    expected[0].client = client;
    expected[0].urgent = true;

    const filterHook = renderHook(() => useFilters(expected));
    const { filters, setFilters } = filterHook.result.current;

    // Apply the filter
    setFilters.external({ ...filters.external, global_urgent: true });
    filterHook.rerender();
    // Assert that only urgent items are returned
    expect(filterHook.result.current.filteredItems).toHaveLength(1);
    expect(filterHook.result.current.filteredItems[0].client.first_name).toBe('jonathan');
  });

  it('should filter by species', () => {
    const notPerry = items.map(element => {
      const item = { ...element, pet: { name: 'notPerry', species: 'snail' } };
      return item;
    });
    const expected = notPerry.map(e => ({ ...e }))
    const client = { first_name: 'Phineas', last_name: 'Fletcher' }
    expected[0].client = client;
    expected[0].pet = { name: 'PERRY', species: 'platypus' };

    const filterHook = renderHook(() => useFilters(expected));
    const { filters, setFilters } = filterHook.result.current;
    setFilters.external({ ...filters.external, global_species: ['platypus'] });
    filterHook.rerender();

    expect(filterHook.result.current.filteredItems).toHaveLength(1);
    expect(filterHook.result.current.filteredItems[0].pet.species).toBe('platypus');
    expect(filterHook.result.current.filteredItems[0].pet.name).toBe('PERRY');
  });

  it('should filter by firstname/lastname/petname', () => {
    const notNeo = items.map(element => {
      const item = {
        ...element,
        client: { first_name: 'agent', last_name: 'smith' },
        pet: { ...element.pet, name: "bobby" }
      };
      return item;
    });
    const expected = notNeo.map(e => ({ ...e }))
    let client = { first_name: 'neo', last_name: 'smith' };
    expected[0].client = client;
    client = { first_name: 'agent', last_name: 'the-one' }
    expected[1].client = client;
    expected[2].pet.name = 'white-rabbit';

    const filterHook = renderHook(() => useFilters(expected));
    const { filters, setFilters } = filterHook.result.current;

    setFilters.external({ ...filters.external, owner_and_pet: 'neo' });
    filterHook.rerender();

    expect(filterHook.result.current.filteredItems).toHaveLength(1);
    expect(filterHook.result.current.filteredItems[0].client.first_name).toBe('neo');

    setFilters.external({ ...filters.external, owner_and_pet: 'the-one' });
    filterHook.rerender();

    expect(filterHook.result.current.filteredItems).toHaveLength(1);
    expect(filterHook.result.current.filteredItems[0].client.last_name).toBe('the-one');

    setFilters.external({ ...filters.external, owner_and_pet: 'white-rabbit' });
    filterHook.rerender();

    expect(filterHook.result.current.filteredItems).toHaveLength(1);
    expect(filterHook.result.current.filteredItems[0].pet.name).toBe('white-rabbit');
  });

  it('should clear filters', () => {
    const filterHook = renderHook(() => useFilters(items));
    const { filters, setFilters } = filterHook.result.current;

    expect(filterHook.result.current.filters.areFiltersActive).toEqual(false);
    setFilters.external({
      ...filters.external,
      owner_and_pet: 'billy bob joe',
      global_species: ['cat'],
      global_urgent: true
    });
    filterHook.rerender();
    expect(filterHook.result.current.filters.areFiltersActive).toEqual(true);
    expect(filterHook.result.current.filters.external).not.toEqual(defaultExternalFilters);
    setFilters.clear();
    filterHook.rerender();
    expect(filterHook.result.current.filters.areFiltersActive).toEqual(false);
    expect(filterHook.result.current.filters.external).toEqual(defaultExternalFilters);
  });

})