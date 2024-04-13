/* eslint-disable @typescript-eslint/no-unused-vars */

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
import { SearchOptions, clientService } from '../../src/services/ClientService';
import { RequestType as ServiceRequestType } from '../../src/types';

function Clients() {
  const { push } = useRouter();
  const { data: sources } = useAppConstants('source');
  const { data: categories } = useAppConstants('category');

  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    first: 0,
    rows: 10,
    page: 0,
    pageCount: 0,
  });
  const [tickets, setTickets] = useState([]);
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

  const handlePaging = (event: DataTableStateEvent) => {
    setSearchOptions({
      first: event.first,
      rows: event.rows,
      page: event.page,
      pageCount: event.pageCount,
    });
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

  const sourceBodyTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">Status</span>
      {sources && sources.find((app) => app.id === rowData.request_source_id).label}
    </>
  );

  const categoryBodyTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">Status</span>
      {categories && categories.find((app) => app.id === rowData.service_category_id).label}
    </>
  );

  const descriptionTemplate = (rowData: ServiceRequestType) => (
    <>
      <span className="p-column-title">Urgency</span>
      {rowData.description}
    </>
  );

  const actionBodyTemplate = (rowData) => (
    <>
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editTicket(rowData)} />
      <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteTicket(rowData)} />
    </>
  );

  const teamMemberTemplate = (rowData) => (
    <>
      <span className="p-column-title">Team Member</span>
      {rowData.team_members ? rowData.team_members.email : ''}
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
            totalRecords={totalRecords}
            first={searchOptions.first}
            selection={selectedTickets}
            onSelectionChange={(e) => setSelectedTickets(e.value)}
            dataKey="ticketNo"
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
            <Column header="Source" body={sourceBodyTemplate} />
            <Column header="Category" body={categoryBodyTemplate} />
            <Column header="Description" body={descriptionTemplate} />
            <Column header="Team Member" body={teamMemberTemplate} />
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
