import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Link from 'next/link';
import type { ServiceRequestSummary } from '@types';

export interface TicketsTableProps {
  items: ServiceRequestSummary[]
}

function OwnerAndPetTemplate({ client, pet, urgent, id }) {
  return (
    <div key={id}>
      <Link href={`?ticket=${id}`}>
        <div className={`font-bold text-${urgent?'red-500':'gray-900'}`}>{pet}</div>
        <div className={`capitalize text-${urgent?'red-400':'gray-600'}`}>{client}</div>
      </Link>
    </div>
  );
}

function CreatedAtTemplate({ created_at, id, urgent }) {
  return (
    <span key={id}>
      <Link className={`text-${urgent?'red-500':'gray-900'}`} href={`?ticket=${id}`}>
        {new Date(created_at).toLocaleDateString('en-US', {
          day: '2-digit', month: '2-digit', year: 'numeric',
        })}
      </Link>
    </span>
  );
}

function descriptionView({ id, description, urgent }) {
  return (
    <Link className={`text-${urgent?'red-500':'gray-900'}`} href={`?ticket=${id}`} key={id}>
      {description}
    </Link>
  );
}
function catergoryView({ id, category, urgent }) {
  return (
    <Link className={`text-${urgent?'red-500':'gray-900'}`} href={`?ticket=${id}`} key={id}>
      {category}
    </Link>
  );
}
function TeamMemberView({ id, team_member, urgent }) {
  return (
    <Link className={`text-${urgent?'red-500':'gray-900'}`} href={`?ticket=${id}`} key={id}>
      {team_member}
    </Link>
  );
}
function UrgentView({ id, urgent }) {
  return (
    <Link className={`font-bold text-${urgent?'red-500':'gray-900'}`} href={`?ticket=${id}`} key={id}>
      {urgent ? 'URGENT' : ''}
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
      removableSort
    >
      <Column field="pet" body={OwnerAndPetTemplate} header="Owner" sortable />
      <Column field="urgent" body={UrgentView} header="Urgent" sortable />
      <Column field="category" header="Category" body={catergoryView} className="font-bold" sortable />
      <Column field="description" header="Description" body={descriptionView} className="font-bold" />
      <Column field="created_at" body={CreatedAtTemplate} header="Date" className="font-bold" sortable />
      <Column field="team_member" body={TeamMemberView} header="Team member" className="font-bold" />
    </DataTable>
  );
}

export default TicketsTable;
