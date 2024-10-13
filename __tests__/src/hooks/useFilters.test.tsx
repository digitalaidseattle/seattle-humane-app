import useFilters, { defaultExternalFilters, defaultInternalFilters, filterByCreatedAt, passThroughFilter } from '@hooks/useFilters';
import { renderHook } from '@testing-library/react';
import { mockServiceRequestSummaries } from '@utils/TestData';

describe('useFilter hook', () => {
  const dates = ['1/1/2000', '1/2/2000', '3/1/2000', '1/1/2020', '12/12/2010'];
  const items = mockServiceRequestSummaries;
  
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
      owner_and_pet: 'billy bob joe',
      global_species: ['cat'],
      global_urgent: true
    });
    setFilters.internal({
      global: { ...filters.internal.global, value: 'hello' },
      service_category: { ...filters.internal.service_category, value: 'cat2' },
      'team_member.email': { ...filters.internal['team_member.email'], value: 'hi@hi.com' },
      created_at: { ...filters.internal.created_at, value: '2/2/2020' },
      'client.first_name': { ...filters.internal['client.first_name'], value: 'jimmy neutron' },
    });
    filterHook.rerender();
    expect(filterHook.result.current.filters.areFiltersActive).toEqual(true);
    expect(filterHook.result.current.filters.external).not.toEqual(defaultExternalFilters);
    expect(filterHook.result.current.filters.internal).not.toEqual(defaultInternalFilters);
    setFilters.clear();
    filterHook.rerender();
    expect(filterHook.result.current.filters.areFiltersActive).toEqual(false);
    expect(filterHook.result.current.filters.external).toEqual(defaultExternalFilters);
    expect(filterHook.result.current.filters.internal).toEqual(defaultInternalFilters);
  });

  it('passthrough filter always return true', () => {
    expect(passThroughFilter()).toBe(true);
  });

  it('exact date filter', () => {
    const date = '1/1/1999';
    const filter = { sign: '=', filterDate: date };
    expect(filterByCreatedAt(date, filter)).toBe(true);
    expect(filterByCreatedAt('1/1/2020', filter)).toBe(false);
  });

  it('dates after filter', () => {
    const expected = ['3/1/2000', '1/1/2020', '12/12/2010'];
    const filter = { sign: '>', filterDate: '2/20/2000' };
    const actual = dates.filter(d => filterByCreatedAt(d, filter));
    expect(actual.length).toBe(3);
    expect(actual).toEqual(expected);
  });

  it('dates before filter', () => {
    const expected = ['1/1/2000', '1/2/2000', '3/1/2000'];
    const filter = { sign: '<', filterDate: '1/1/2005' };
    const actual = dates.filter(d => filterByCreatedAt(d, filter));
    expect(actual.length).toBe(3);
    expect(actual).toEqual(expected);
  });

  it('return empty array when no dates match filter', () => {
    const beforeFilter = { sign: '<', filterDate: '1/1/1000' };
    const afterFilter = { sign: '>', filterDate: '1/1/3000' };
    const exactFilter  = { sign: '=', filterDate: '1/1/1000' };
    const actualBefore = dates.filter(d => filterByCreatedAt(d, beforeFilter));
    const actualExact = dates.filter(d => filterByCreatedAt(d, exactFilter));
    const actualAfter = dates.filter(d => filterByCreatedAt(d, afterFilter));
    const expected = [];
    expect(actualBefore).toEqual(expected);
    expect(actualExact).toEqual(expected);
    expect(actualAfter).toEqual(expected);
  });
});
