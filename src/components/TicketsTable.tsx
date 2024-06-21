import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { ServiceRequestSummary } from '@types';

export interface TicketsTableProps {
  items: ServiceRequestSummary[]
}

function OwnerAndPetTemplate({ client, pet }) {
  return (
    <div>
      <div className="font-bold">{pet}</div>
      <div>{client}</div>
    </div>
  );
}

function CreatedAtTemplate({ created_at }) {
  return (
    <span>
      {new Date(created_at).toLocaleDateString('en-US', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      })}
    </span>
  );
}

function TicketsTable({ items }: TicketsTableProps) {
  return (
    <DataTable value={items}>
      <Column body={OwnerAndPetTemplate} header="Owner" />
      <Column field="category" header="Category" className="font-bold" />
      <Column field="description" header="Description" className="font-bold" />
      <Column body={CreatedAtTemplate} header="Date" className="font-bold" />
      <Column field="team_member" header="Team member" className="font-bold" />
    </DataTable>
  );
}

export default TicketsTable;
