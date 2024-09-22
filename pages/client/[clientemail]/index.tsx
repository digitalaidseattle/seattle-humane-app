'use client';

import PetInformationSection from '@components/serviceRequest/PetInformationSection';
import { PetInformationContext } from '@context/serviceRequest/petInformationContext';
import useCustomerTickets from '@hooks/useCustomerTickets';
import { ServiceRequestSummary } from '@types';
import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
/**
* client/index.tsx
*
* @2024 Digital Aid Seattle
*/
import React, { } from 'react';

function Client() {
  const { query } = useRouter();
  const { clientemail } = query;
  const { data: clientTickets } = useCustomerTickets(clientemail as string);
  if (!clientTickets.length) return <span>No data</span>;

  const [firstTicket] = clientTickets;
  const { client: { firstName, email } } = firstTicket;
  const catMap = new Map<string, typeof clientTickets>();
  clientTickets.forEach((ticket) => {
    const { category } = ticket;
    if (!catMap.has(category)) catMap.set(category, []);
    catMap.get(category)!.push(ticket);
  });
  return (
    <div className="grid flex">
      <div className="col-12">
        <div className="card">
          <h1>
            {firstName}
          </h1>
          <span>
            <strong>
              Email:
              {' '}
            </strong>
            <em>{email}</em>
          </span>
          <h2>Open cases</h2>
          {[...catMap].map(([category, tickets]) => (
            <div key={category}>
              <div className="mb-2 mt-4 flex flex-row align-items-center">
                <span className="text-2xl font-bold mr-3">{category}</span>
              </div>
              <DataTable value={tickets}>
                <Column field="pets.name" header="Pet" />
                <Column field="description" header="Description" />
                <Column field="created_at" header="Date" body={formatDate} />
                <Column field="urgent" header="Priority" body={PriorityTemplate} />
              </DataTable>
              <Button label="Add" severity="primary" text raised rounded />
            </div>
          ))}
          <div className="flex flex-row mt-3 mb-1">
            <Dropdown
              placeholder="Add a service"
            />
          </div>
          <h2>Closed cases</h2>
        </div>
      </div>
    </div>
  );
}

// function PetTemplate(ticket) {
//   return ticket.pets;
// }
function PriorityTemplate({ urgent }: ServiceRequestSummary) {
  return urgent ? <Tag severity="danger">Urgent</Tag> : null;
}
function formatDate(ticket: ServiceRequestSummary) {
  return new Date(ticket.created_at).toLocaleString('en-us', { day: '2-digit', year: '2-digit', month: '2-digit' });
}

export default Client;
