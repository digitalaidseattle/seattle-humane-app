/* eslint-disable @typescript-eslint/no-unused-vars */
import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimalDialog from '@components/AnimalDialog';
import { ClientTicket, clientService } from '@services/ClientService';

function Animals() {
  const { push } = useRouter();

  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState(null);
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

  const editTicket = (ticket: ClientTicket) => {
    push(`/client?ticketNo=${ticket.ticketNo}`);
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

  const codeBodyTemplate = (rowData: ClientTicket) => (
    <>
      <span className="p-column-title">Code</span>
      {rowData.ticketNo}
    </>
  );

  const typeBodyTemplate = (rowData: ClientTicket) => (
    <>
      <span className="p-column-title">Type</span>
      {rowData.type}
    </>
  );

  const nameBodyTemplate = (rowData: ClientTicket) => (
    <>
      <span className="p-column-title">Name</span>
      {rowData.name}
    </>
  );

  const statusBodyTemplate = (rowData: ClientTicket) => (
    <>
      <span className="p-column-title">Status</span>
      {rowData.status}
    </>
  );

  const urgencyBodyTemplate = (rowData: ClientTicket) => (
    <>
      <span className="p-column-title">Urgency</span>
      {rowData.urgency}
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
      <h5 className="m-0">Manage Animal Records</h5>
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
            dataKey="ticketNo"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} tickets"
            globalFilter={globalFilter}
            emptyMessage="No records found."
            header={header}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
            <Column header="Status" body={statusBodyTemplate} />
            <Column header="Urgency" body={urgencyBodyTemplate} />
            <Column field="name" header="Name" sortable headerStyle={{ minWidth: '15rem' }} />
            <Column field="email" header="Email" sortable headerStyle={{ minWidth: '15rem' }} />
            <Column field="phone" header="Phone" sortable headerStyle={{ minWidth: '15rem' }} />
            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }} />
          </DataTable>

          <AnimalDialog
            visible={clientDialog}
            onClose={closeClientDialog}
          />
        </div>
      </div>
    </div>
  );
}

export default Animals;
