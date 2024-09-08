import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import type { ServiceRequestSummary } from '@types';
import {
  CreatedAtBodyTemplate, OwnerAndPetBodyTemplate, TeamMemberBodyTemplate, UrgentBodyTemplate,
} from './Templates';

export interface TicketsTableProps {
  items: ServiceRequestSummary[]
  loading?: boolean
}

function TicketsTable({ items, loading }: TicketsTableProps) {
  const router = useRouter();

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
    >
      <Column body={OwnerAndPetBodyTemplate} header="Owner" />
      <Column field="urgent" body={UrgentBodyTemplate} header="Urgent" dataType='boolean' className="font-bold" />
      <Column field="category" header="Category" className="font-bold" />
      <Column field="description" header="Description" className="font-bold" />
      <Column body={CreatedAtBodyTemplate} header="Date" className="font-bold" />
      <Column field="team_member" body={TeamMemberBodyTemplate} header="Team member" className="font-bold" />
    </DataTable>
  );
}

export default TicketsTable;
