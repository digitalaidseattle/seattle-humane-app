/* eslint-disable @typescript-eslint/no-unused-vars */

import { SearchOptions, RequestType as ServiceRequestType } from '@types';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useEffect, useRef, useState } from 'react';
import { useAppConstants } from 'src/services/useAppConstants';
import ClientDialog from '../../src/components/ClientDialog';
import { clientService } from '../../src/services/ClientService';

function Clients() {
  const { push } = useRouter();

  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    first: 0,
    rows: 10,
    page: 0,
    pageCount: 0,
  });
  const [tickets, setTickets] = useState<ServiceRequestType[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [selectedTickets, setSelectedTickets] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const [clientDialog, setClientDialog] = useState(false);

  useEffect(() => {
    if (searchOptions) {
      Promise.all([
        clientService.getServiceRequests(searchOptions),
        clientService.getServiceRequestsTotalRecords(),
      ]).then((resps) => {
        setTickets(resps[0]);
        setTotalRecords(resps[1]);
      });
    }
  }, [searchOptions]);

  const handlePaging = (event: DataTableStateEvent) => {
    setSearchOptions({
      first: event.first,
      rows: event.rows,
      page: event.page,
      pageCount: event.pageCount,
    });
  };

  const openClientDialog = () => {
    setClientDialog(true);
  };

  const closeClientDialog = (item) => {
    setClientDialog(false);
    // clientService.getTickets()
    //     .then(t => setTickets(t));
  };

  const editTicket = (ticket: ServiceRequestType) => {
    push(`/client?ticketNo=${ticket.id}`);
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

  const codeBodyTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">Code</span>
      {rowData.id}
    </>
  );

  const typeBodyTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">Type</span>
      FIXME rowData.type
    </>
  );

  const descriptionBodyTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">Description</span>
      {rowData.description}
    </>
  );

  const emailBodyTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">Description</span>
      {rowData.team_members.email}
    </>
  );

  const statusBodyTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">Status</span>
      {rowData.status}
    </>
  );

  const urgencyBodyTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">Urgency</span>
      FIXME rowData.urgency
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
      <h5 className="m-0">Manage Service Requests</h5>
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
            totalRecords={totalRecords}
            first={searchOptions.first}
            onSelectionChange={(e) => setSelectedTickets(e.value)}
            dataKey="id"
            paginator
            rows={searchOptions.rows}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} service requests"
            globalFilter={globalFilter}
            emptyMessage="No service requests found."
            header={header}
            onPage={handlePaging}
            lazy
          >
            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
            <Column header="Status" body={statusBodyTemplate} />
            <Column header="Urgency" body={urgencyBodyTemplate} />
            <Column body={descriptionBodyTemplate} header="Description" sortable headerStyle={{ minWidth: '15rem' }} />
            <Column body={emailBodyTemplate} header="Assigned To" sortable headerStyle={{ minWidth: '15rem' }} />
            <Column field="phone" header="Phone" sortable headerStyle={{ minWidth: '15rem' }} />
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
