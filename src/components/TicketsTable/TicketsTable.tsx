import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { useRouter } from 'next/router';
import type { ServiceRequestSummary } from '@types';
import { FilterMatchMode, FilterService } from 'primereact/api';
import {
  ChangeEvent, useEffect, useState,
} from 'react';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants } from 'src/constants';
import useTeamMembersAll from '@hooks/useTeamMembersAll';
import {
  CategoryFilterTemplate,
  CreatedAtBodyTemplate,
  CreatedAtFilterTemplate,
  HeaderTemplate,
  OwnerAndPetFilterTemplate,
  OwnerAndPetTemplate,
  TeamMemberBodyTemplate,
  TeamMemberFilterTemplate,
} from './Templates';

export interface TicketsTableProps {
  items: ServiceRequestSummary[]
  loading?: boolean
}

FilterService.register('custom_created_at', (value, filter) => {
  if (!filter || !filter.filterDate) return true;
  const filterDate = new Date(filter.filterDate);
  const date = new Date(value);
  const { sign } = filter;
  if (sign === '>') return date >= filterDate;
  if (sign === '<') return date <= filterDate;
  if (sign === '=') return date === filterDate;
  throw new Error("invalid 'sign' in filters object at custom_date filter");
});

// disables datatable filtering for the first column (client.first_name) but keeps it registered to datatable interal state that filter changes are synced.
FilterService.register('custom_client.first_name', () => true);

type TicketsTableFilters = { [key: string]: { value: any, filterOptions?: string[] } };

function TicketsTable({ items, loading }: TicketsTableProps) {
  const router = useRouter();
  const {
    data: speciesOptions,
    isLoading: speciesListLoading,
  } = useAppConstants(AppConstants.Species);
  const { data: categoryOptions } = useAppConstants(AppConstants.Category);
  const { data: teamMemberOptions } = useTeamMembersAll();
  const [filteredItems, setFilteredItems] = useState(items);
  const defaultExternalFilters: TicketsTableFilters = {
    global_urgent: { value: null },
    owner_and_pet: { value: '' },
    global_species: { value: [], filterOptions: speciesOptions.map((op) => op.label) },
  };
  const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    service_category: { value: null, matchMode: FilterMatchMode.IN },
    'team_member.email': { value: null, matchMode: FilterMatchMode.IN },
    created_at: { value: null, matchMode: FilterMatchMode.CUSTOM },
    'client.first_name': { value: '', matchMode: FilterMatchMode.CUSTOM },
  };
  const [filtersActive, setFiltersActive] = useState(false);
  const [externalFilters, setExternalFilters] = useState({ ...defaultExternalFilters });
  const [internalFilters, setInternalFilters] = useState({ ...defaultFilters });

  function unifiedFilterHandler({
    internalFilters: nInternalFilters,
    externalFilters: nExternalFilters,
  }:
    { internalFilters: DataTableFilterMeta, externalFilters: TicketsTableFilters }) {
    let nFilteredItems = items || [];
    let filteredState = false;
    let filterValue;

    // external filtering
    // urgent
    filterValue = nExternalFilters.global_urgent.value;
    if (filterValue !== null) {
      nFilteredItems = nFilteredItems.filter((item) => item.urgent === filterValue);
      filteredState = true;
    }

    // client & pet
    filterValue = nExternalFilters.owner_and_pet.value.toLowerCase();
    if (filterValue !== '') {
      filteredState = true;
      nFilteredItems = nFilteredItems.filter((item) => {
        const fieldValues = [
          item.client.first_name,
          item.client.last_name,
          item.pet.name,
        ].map((i) => i.toLowerCase());
        return fieldValues.some((value) => value.includes(filterValue));
      });
    }

    // species
    filterValue = nExternalFilters.global_species.value;
    if (filterValue.length > 0) {
      filteredState = true;
      nFilteredItems = nFilteredItems.filter(
        (item) => filterValue.some(
          (option) => option.includes(item.pet.species),
        ),
      );
    }
    // check whether or not there are any active internal filters
    Object.keys(nInternalFilters).forEach(
      (key) => {
        // @ts-expect-error, value is part of the union but not part of both types
        const defaultValue = JSON.stringify(defaultFilters[key].value);
        // @ts-expect-error
        let nValue = JSON.stringify(nInternalFilters[key].value);
        if (nValue === '[]') nValue = 'null';
        if (nValue !== defaultValue) filteredState = true;
      },
    );
    setFilteredItems(nFilteredItems);
    setInternalFilters(nInternalFilters); // this is attached to datatable's internal rerender mechanism
    setFiltersActive(filteredState);
  }

  useEffect(() => {
    if (speciesListLoading) return;
    setExternalFilters(defaultExternalFilters);
  }, [speciesListLoading]);

  useEffect(() => {
    if (loading) return;
    unifiedFilterHandler({ internalFilters, externalFilters });
  }, [externalFilters, loading]);

  const resetFilters = () => {
    if (!filtersActive) return;
    setFiltersActive(false);
    setInternalFilters(defaultFilters);
    setExternalFilters(defaultExternalFilters);
  };

  const header = HeaderTemplate({
    resetHandler: resetFilters,
    filtersActive,
    filters: externalFilters,
    setFilters: setExternalFilters,
  });

  const ownerAndPetFilterHandler = (e: ChangeEvent<HTMLInputElement>, internalFilterCB: ColumnFilterElementTemplateOptions['filterApplyCallback']) => {
    const nExternalFilters = { ...externalFilters };
    nExternalFilters.owner_and_pet.value = e.target.value;
    setExternalFilters(nExternalFilters);
    // this sets options.value which is the input state
    internalFilterCB(e.target.value);
  };

  return (
    <DataTable
      header={header}
      value={filteredItems}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      dataKey="id"
      paginator
      emptyMessage="No data found."
      loading={loading}
      className="datatable-responsive cursor-pointer"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tickets"
      rows={10}
      onRowClick={(e) => router.push(`?ticket=${e.data.id}`)}
      rowClassName={(rowData) => `${rowData.urgent ? 'text-red-500' : ''} font-bold capitalize`}
      rowHover
      filters={internalFilters}
      filterDisplay="menu"
      onFilter={(event) => unifiedFilterHandler({
        internalFilters: event.filters,
        externalFilters,
      })}
    >
      <Column header="Name" field="client.first_name" body={OwnerAndPetTemplate} filter showClearButton={false} showFilterMatchModes={false} filterElement={(options) => OwnerAndPetFilterTemplate({ options, externalFilterHandler: ownerAndPetFilterHandler })} filterPlaceholder="Name" />
      <Column header="Category" field="service_category" filter showFilterMatchModes={false} filterElement={(options) => CategoryFilterTemplate({ options, optionList: categoryOptions })} className="w-3" />
      <Column header="Date" field="created_at" body={CreatedAtBodyTemplate} filter filterElement={CreatedAtFilterTemplate} dataType="date" showFilterMatchModes={false} />
      <Column header="Team member" field="team_member.first_name" filterField="team_member.email" body={TeamMemberBodyTemplate} filter showFilterMatchModes={false} filterElement={(options) => TeamMemberFilterTemplate({ options, optionList: teamMemberOptions })} className="min-w-6" />
    </DataTable>
  );
}

export default TicketsTable;
