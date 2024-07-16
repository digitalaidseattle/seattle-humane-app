import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from 'next/link';
import type { ServiceRequestSummary } from '@types';

export interface TicketsTableProps {
  items: ServiceRequestSummary[]
}

function OwnerAndPetTemplate({ client, pet, id }) {
  return (
    <div key={id}>
      <Link href={`?ticket=${id}`}>
        <div className="font-bold text-gray-900">{pet}</div>
        <div className="capitalize text-gray-600">{client}</div>
      </Link>

    </div>
  );
}

function CreatedAtTemplate({ created_at, id }) {
  return (
    <span key={id}>
      <Link className="text-gray-900" href={`?ticket=${id}`}>
        {new Date(created_at).toLocaleDateString('en-US', {
          day: '2-digit', month: '2-digit', year: 'numeric',
        })}
      </Link>
    </span>
  );
}

function descriptionView({ id, description }) {
  return (
    <Link className="text-gray-900" href={`?ticket=${id}`} key={id}>
      {description}
    </Link>
  );
}
function catergoryView({ id, category }) {
  return (
    <Link className="text-gray-900" href={`?ticket=${id}`} key={id}>
      {category}
    </Link>
  );
}
function TeamMemberView({ id, team_member }) {
  return (
    <Link className="text-gray-900" href={`?ticket=${id}`} key={id}>
      {team_member}
    </Link>
  );
}
function UrgentView({ id, urgent }) {
  return (
    <Link className="text-gray-900" href={`?ticket=${id}`} key={id}>
      {urgent ? 'Urgent' : ''}
    </Link>
  );
}

function TicketsTable({ items }: TicketsTableProps, i) {
  return (
    <DataTable
      value={items}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      dataKey="id"
      paginator
      emptyMessage="No data found."
      className="datatable-responsive"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tickets"
      rows={10}
      key={i}
    >

      <Column body={OwnerAndPetTemplate} header="Owner" />
      <Column field="urgent" body={UrgentView} header="Urgent" />
      <Column field="category" header="Category" body={catergoryView} className="font-bold" />
      <Column field="description" header="Description" body={descriptionView} className="font-bold" />
      <Column body={CreatedAtTemplate} header="Date" className="font-bold" />
      <Column field="team_member" body={TeamMemberView} header="Team member" className="font-bold" />
    </DataTable>
  );
}

export default TicketsTable;
