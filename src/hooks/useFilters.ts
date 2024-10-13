import { ServiceRequestSummary } from '@types';
import { FilterMatchMode } from 'primereact/api';
import { DataTableFilterMeta } from 'primereact/datatable';
import { useMemo, useState } from 'react';

export function passThroughFilter() { return true; }

export const defaultExternalFilters = {
  global_urgent: null,
  owner_and_pet: '',
  global_species: [],
};
export const defaultInternalFilters: DataTableFilterMeta = {
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  service_category: { value: null, matchMode: FilterMatchMode.IN },
  'team_member.email': { value: null, matchMode: FilterMatchMode.IN },
  created_at: { value: null, matchMode: FilterMatchMode.CUSTOM },
  'client.first_name': { value: '', matchMode: FilterMatchMode.CUSTOM },
};
export default function useFilters(items: ServiceRequestSummary[]) {
  const [externalFilters, setExternalFilters] = useState(defaultExternalFilters);
  const [internalFilters, setInternalFilters] = useState(defaultInternalFilters);

  const filterByUrgent = (request: ServiceRequestSummary) => {
    if (externalFilters.global_urgent) {
      return request.urgent === externalFilters.global_urgent
    }
    return passThroughFilter();
  };
  const filterBySpecies = (request: ServiceRequestSummary) => {
    if (externalFilters.global_species.length > 0) {
      return externalFilters.global_species.some(
        (currentSpeciesFilters) => currentSpeciesFilters.includes(request.pet.species)
      )
    }
    return passThroughFilter()
  };
  const filterByName = (request: ServiceRequestSummary) => {
    const filterValue = externalFilters['owner_and_pet'];
    if (filterValue) {
      const filteredFieldsContent = [
        request.client.first_name,
        request.client.last_name,
        request.pet.name
      ];
      return filteredFieldsContent.some(
        (name) => name.toLowerCase().includes(filterValue.toLowerCase())
      )
    }
    return passThroughFilter();
  };

  const filteredItems = useMemo(() => items.filter((item) =>
    filterByUrgent(item)
    && filterBySpecies(item)
    && filterByName(item)
  ), [items, externalFilters]);

  const areFiltersActive = useMemo(() => {
    const jsonCompare = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const internalFiltersState = Object.keys(internalFilters).every((key) => {
      // @ts-expect-error, value is part of the union but not part of both types
      const dv = defaultInternalFilters[key].value;
      // @ts-expect-error
      const nv = internalFilters[key].value;
      // categories default is null but once cleared it's set to []
      return !jsonCompare(dv, nv === '[]' ? 'null' : nv);
    }, [internalFilters, externalFilters]);
    const externalFiltersState = Object.keys(externalFilters)
      .some((key) => (
        !jsonCompare(defaultExternalFilters[key], externalFilters[key])));
    return internalFiltersState || externalFiltersState;
  }, [externalFilters, internalFilters]);

  const clearFilters = () => {
    setInternalFilters(defaultInternalFilters);
    setExternalFilters(defaultExternalFilters);
  };

  return {
    filteredItems,
    filters: { internal: internalFilters, external: externalFilters, areFiltersActive },
    setFilters: { internal: setInternalFilters, external: setExternalFilters, clear: clearFilters },
  };
}

export function filterByCreatedAt(value, filter) {
  if (!filter || !filter.filterDate) return true;
  const filterDate = Date.parse(filter.filterDate);
  const date = Date.parse(value);
  const { sign } = filter;
  if (sign === '>') return date >= filterDate;
  if (sign === '<') return date <= filterDate;
  if (sign === '=') return date === filterDate;
  throw new Error("invalid 'sign' in filters object at custom_date filter");
}
