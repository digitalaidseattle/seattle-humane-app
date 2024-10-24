import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { useRouter } from 'next/router';
import type { ServiceRequestSummary } from '@types';
import { FilterService } from 'primereact/api';
import { ChangeEvent } from 'react';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants } from 'src/constants';
import useTeamMembersAll from '@hooks/useTeamMembersAll';
import useFilters, { filterByCreatedAt, passThroughFilter } from '@hooks/useFilters';
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

FilterService.register('custom_created_at', filterByCreatedAt);

// disable datatable filtering for the first column (client.first_name)
// but keeps it registered to datatable interal state that filter changes are synced.
FilterService.register('custom_client.first_name', passThroughFilter);

function TicketsTable({ items, loading }: TicketsTableProps) {
  const router = useRouter();
  const { data: categoryOptions } = useAppConstants(AppConstants.Category);
  const { data: teamMemberOptions } = useTeamMembersAll();
  const { filteredItems, filters, setFilters } = useFilters(items || []);

  const ownerAndPetFilterHandler = (
    e: ChangeEvent<HTMLInputElement>,
    internalFilterCB: ColumnFilterElementTemplateOptions['filterApplyCallback'],
  ) => {
    const nExternalFilters = { ...filters.external };
    nExternalFilters.owner_and_pet = e.target.value;
    setFilters.external(nExternalFilters);
    // this sets options.value which is the input state
    internalFilterCB(e.target.value);
  };

  const header = HeaderTemplate({
    resetHandler: setFilters.clear,
    areFiltersActive: filters.areFiltersActive,
    filters: filters.external,
    setFilters: setFilters.external,
  });

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
      filters={filters.internal}
      filterDisplay="menu"
      onFilter={(event) => setFilters.internal(event.filters as any)}
    >
      <Column header="Name" field="client.first_name" body={OwnerAndPetTemplate} filter showClearButton={false} showFilterMatchModes={false} filterElement={(options) => OwnerAndPetFilterTemplate({ options, externalFilterHandler: ownerAndPetFilterHandler })} filterPlaceholder="Name" />
      <Column header="Category" field="service_category" filter showFilterMatchModes={false} filterElement={(options) => CategoryFilterTemplate({ options, optionList: categoryOptions })} className="w-3" />
      <Column header="Date" field="created_at" body={CreatedAtBodyTemplate} filter filterElement={CreatedAtFilterTemplate} dataType="date" showFilterMatchModes={false} />
      <Column header="Team member" field="team_member.first_name" filterField="team_member.email" body={TeamMemberBodyTemplate} filter showFilterMatchModes={false} filterElement={(options) => TeamMemberFilterTemplate({ options, optionList: teamMemberOptions })} className="min-w-6" />
    </DataTable>
  );
}

export default TicketsTable;
