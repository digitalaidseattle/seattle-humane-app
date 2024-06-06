/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable react/jsx-closing-tag-location */
/**
* client/index.tsx
*
* @2024 Digital Aid Seattle
*/
import useAppConstants from '@hooks/useAppConstants';
import { ServiceRequestType } from '@types';
import { useRouter } from 'next/navigation';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useEffect, useRef, useState } from 'react';
import { AppConstants } from 'src/constants';
import { clientService } from '../../src/services/ClientService';

function Client() {
  const { push } = useRouter();
  // TODO create LoadingContext & Loading Indicator in layout
  const [_loading, setLoading] = useState(false);
  // TODO create customHook for serviceCategories
  const categories = useAppConstants(AppConstants.Category);
  const statuses = useAppConstants(AppConstants.Status);

  const [ticket, setTicket] = useState<ServiceRequestType>();
  const toast = useRef(null);

  const home = { icon: 'pi pi-home', url: '/' };

  useEffect(() => {
    setLoading(true);
    const id = new URLSearchParams(window.location.search).get('id');
    clientService.getTicket(id)
      .then((resp) => setTicket(resp))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const crumbs = [
    {
      label: 'Clients',
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      template: (<a onClick={() => push('/clients')}>
        <span>Clients</span>
      </a>),
    }, {
      template: <span>
        Request:
        {ticket ? ticket.id : 'New Request'}
      </span>,
    },
  ];

  const leftToolbarTemplate = () => (
    <div className="my-2">
      <Button label="Action" icon="pi pi-plus" className=" mr-2" onClick={() => alert('action')} />
      {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
    </div>
  );

  const rightToolbarTemplate = () => (
    <>
      <Button label="Another action" icon="pi" className=" mr-2" onClick={() => alert('another action')} />
      {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" /> */}
      {/* <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
    </>
  );

  const changeProp = (prop: string, value: any) => {
    const clone = Object.assign(ticket, { prop, value });
    setTicket(clone);
  };

  const update = () => {
    clientService.update(ticket)
      .then((t) => setTicket(t));
  };

  return (
    <div className="grid flex">
      <div className="col-12">
        <BreadCrumb model={crumbs} home={home} />

        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate} />
          {ticket
            && (
              <div className="grid">
                <div className="col-12 lg:col-6 xl:col-6">
                  <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                      <div>
                        <span className="block text-500 font-medium mb-3">Info</span>
                      </div>
                      <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-upload text-blue-500 text-xl" />
                      </div>
                    </div>
                    <ul className="list-none p-0 m-0">
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Status</div>
                        <Dropdown
                          value={ticket.status}
                          className="w-full md:w-14rem"
                          // Note: we're updating onBlur.  we may have to change to a "save" button because of performance
                          onBlur={() => update()}
                          onChange={(e) => changeProp('status', e.value)}
                          options={statuses}
                          optionLabel="name"
                          optionValue="code"
                        />
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Service Category</div>
                        <Dropdown
                          value={ticket.service_category}
                          title="Service category options"
                          className="w-full md:w-14rem"
                          // Note: we're updating onBlur.  we may have to change to a "save" button because of performance
                          onBlur={() => update()}
                          onChange={(e) => changeProp('serviceCategoryId', e.value)}
                          options={categories}
                          optionLabel="name"
                          optionValue="id"
                        />
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Description</div>
                        <InputTextarea id="description" onChange={(e) => changeProp('description', e.target.value)} />
                      </li>
                    </ul>
                  </div>

                </div>

                <div className="col-12 lg:col-6 xl:col-6">
                  <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                      <div>
                        <span className="block text-500 font-medium mb-3">Contact</span>
                      </div>
                      <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-send text-blue-500 text-xl" />
                      </div>
                    </div>
                    <ul className="list-none p-0 m-0">
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Name</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                          <InputText id="name" type="text" value={ticket.clients.first_name} onBlur={() => update()} onChange={(e) => changeProp('name', e.target.value)} />
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Phone</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                          <InputMask
                            id="phone"
                            type="text"
                            mask="(999) 999-9999"
                            value={ticket.clients.phone}
                            onBlur={() => update()}
                            onChange={(e) => changeProp('phone', e.target.value)}
                          />
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Email</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                          <InputText id="email" type="text" value={ticket.clients.email} onBlur={() => update()} onChange={(e) => changeProp('email', e.target.value)} />
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-12 lg:col-12 xl:col-12">
                  <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                      <div>
                        <span className="block text-500 font-medium mb-3">History</span>
                      </div>
                      <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                        <i className="pi pi-upload text-blue-500 text-xl" />
                      </div>
                    </div>
                    <ul className="list-none p-0 m-0">
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-6 font-medium">* date/time * rep * Stuff happened </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-6 font-medium">Stuff happened again</div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default Client;
