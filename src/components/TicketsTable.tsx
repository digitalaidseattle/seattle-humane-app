import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import { useState } from 'react';
import type { ServiceRequestSummary } from '@types';

export interface TicketsTableProps {
  items: ServiceRequestSummary[]
  loading?: boolean
}

function OwnerAndPetTemplate({
  client, pet, id, urgent,
}) {
  return (
    <div key={id}>
      <div className={`font-bold ${urgent ? 'text-red-500' : 'text-gray-900'}`}>{pet}</div>
      <div className={`capitalize ${urgent ? 'text-red-300' : 'text-gray-600'}`}>{client}</div>
    </div>
  );
}

function CreatedAtTemplate({ created_at, id }) {
  return (
    <span key={id}>
      {new Date(created_at).toLocaleDateString('en-US', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      })}
    </span>
  );
}

function TeamMemberView({ id, team_member }: ServiceRequestSummary) {
  return (
    <span className="text-gray-900" key={id}>
      {team_member.first_name}
    </span>
  );
}

function UrgentView({ urgent }) {
  return (
    <div>
      {urgent ? 'Urgent' : ''}
    </div>
  );
}

function TicketsTable({ items, loading }: TicketsTableProps) {
  const router = useRouter();
  const [dateSortOrder, setDateSortOrder] = useState<1 | 0 | -1>(0); // 0: unsorted, 1: ascending, -1: descending

  const SortUrgent = (event) => {
    const { field, order } = event;
    return event.data.sort((a, b) => {
      if (a[field] === b[field]) return 0;
      if (order === 1) return a[field] ? -1 : 1;
      return a[field] ? 1 : -1;
    });
  };

  const sortCreatedAt = (event) => {
    const { data, order } = event;
    const sorted = [...data].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return order === 1 ? dateA - dateB : dateB - dateA;
    });
    setDateSortOrder(order);
    return sorted;
  };

  return (
    <DataTable
      value={items}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      dataKey="id"
      paginator
      emptyMessage="No data found."
      loading={loading}
      className="datatable-responsive cursor-pointer"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tickets"
      rows={10}
      onRowClick={(e) => {
        router.push(`?ticket=${e.data.id}`);
      }}
      rowClassName={(rowData) => (rowData.urgent ? 'text-red-500' : '')}
      rowHover
      removableSort
      sortMode="multiple"
    >
      <Column body={OwnerAndPetTemplate} header="Owner" sortable sortField="pet" />
      <Column
        field="urgent"
        body={UrgentView}
        header="Urgent"
        className="font-bold"
        sortable
        sortFunction={SortUrgent}
      />
      <Column field="category" header="Category" className="font-bold" sortable />
      <Column field="description" header="Description" className="font-bold" />
      <Column
        body={CreatedAtTemplate}
        header="Date"
        className="font-bold"
        sortable
        sortField="created_at"
        sortFunction={sortCreatedAt}
      />
      <Column
        field="team_member"
        body={TeamMemberView}
        header="Team member"
        className="font-bold"
        sortable
        sortField="team_member.first_name"
      />
    </DataTable>
  );

}
export default TicketsTable;
