/* eslint-disable @typescript-eslint/no-unused-vars */

import { ServiceRequestType } from '@types';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useEffect, useRef, useState } from 'react';
import ClientDialog from '../../src/components/ClientDialog';
import { clientService } from '../../src/services/ClientService';

function Clients() {
  const { push } = useRouter();

  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState<ServiceRequestType[]>([]);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const [clientDialog, setClientDialog] = useState(false);

  useEffect(() => {
    clientService.getTickets().then((data) => setTickets(data));
  }, []);

  const openClientDialog = () => {
    setClientDialog(true);
  };

  const closeClientDialog = (item) => {
    setClientDialog(false);
    // clientService.getTickets()
    //     .then(t => setTickets(t));
  };

  const editTicket = (ticket: ServiceRequestType) => {
    push(`/client?id=${ticket.id}`);
  };

  const confirmDeleteTicket = (ticket) => {
    // Should we allow deletion?
  };

  const leftToolbarTemplate = () => (
    <div className="my-2">
      <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openClientDialog} />
      {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
    </div>
  );

  const rightToolbarTemplate = () => (
    <>
      {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" /> */}
      {/* <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
    </>
  );

  const categoryBodyTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">id</span>
      {rowData.service_category}
    </>
  );

  const nameBodyTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">Name</span>
      {`${rowData.clients.first_name} ${rowData.clients.last_name}`}
    </>
  );

  const statusBodyTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">Status</span>
      {rowData.status}
    </>
  );

  const actionBodyTemplate = (rowData) => (
    <>
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editTicket(rowData)} />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteTicket(rowData)} />
    </>
  );

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Client Tickets</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target)} placeholder="Search..." />
      </span>
    </div>
  );

  return (
    <div className="grid flex">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate} />

          <DataTable
            ref={dt}
            value={tickets}
            selection={selectedTickets}
            onSelectionChange={(e) => setSelectedTickets(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tickets"
            globalFilter={globalFilter}
            emptyMessage="No tickets found."
            header={header}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
            <Column header="service_category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '15rem' }} />
            <Column header="Status" body={statusBodyTemplate} />
            <Column header="Name" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }} />
            <Column field="clients.email" header="Email" headerStyle={{ minWidth: '15rem' }} />
            <Column field="clients.phone" header="Phone" headerStyle={{ minWidth: '15rem' }} />
            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
          </DataTable>

          <ClientDialog
            visible={clientDialog}
            onClose={closeClientDialog}
          />
        </div>
      </div>
    </div>
  );
}

export default Clients;
