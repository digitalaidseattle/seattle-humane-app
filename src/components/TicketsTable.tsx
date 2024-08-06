import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRouter } from 'next/router';
import type { ServiceRequestSummary } from '@types';

export interface TicketsTableProps {
  items: ServiceRequestSummary[]
}

function OwnerAndPetTemplate({ client, pet, id, urgent }) {
  return (
    <div key={id}>
        <div className={`font-bold ${urgent? 'text-red-500': 'text-gray-900'}`}>{pet}</div>
        <div className={`capitalize ${urgent? 'text-red-300': 'text-gray-600'}`}>{client}</div>
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


function UrgentView({ urgent }) {
  return (
    <>
      {urgent ? "Urgent" : ""}
    </>
  );
}

function TicketsTable({ items }: TicketsTableProps) {
  const router = useRouter();

  return (
    <DataTable
      value={items}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      dataKey="id"
      paginator
      emptyMessage="No data found."
      className="datatable-responsive cursor-pointer"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tickets"
      rows={10}
      onRowClick={(e) => {
        router.push(`?ticket=${e.data.id}`);
      }}
      rowClassName={(rowData) => rowData.urgent ? 'text-red-500' : ''}
      rowHover={true}
    >
      <Column body={OwnerAndPetTemplate} header="Owner" />
      <Column field="urgent" body={UrgentView} header="Urgent" className='font-bold' />
      <Column field="category" header="Category" className="font-bold" />
      <Column field="description" header="Description" className="font-bold" />
      <Column body={CreatedAtTemplate} header="Date" className="font-bold" />
      <Column field="team_member" header="Team member" className="font-bold" />
    </DataTable>
  );
}

export default TicketsTable;
