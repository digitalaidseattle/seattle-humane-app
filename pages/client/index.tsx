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
import { useRouter } from 'next/navigation';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { InputMask } from 'primereact/inputmask';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { AppConstantType } from '@types';
import {
  ClientTicket,
  clientService,
} from '../../src/services/ClientService';

function Client() {
  const { push } = useRouter();
  // TODO create LoadingContext & Loading Indicator in layout
  const [_loading, setLoading] = useState(false);
  // TODO create customHook for serviceCategories
  const [categories, setCategories] = useState<AppConstantType[]>();
  const [statuses, setStatuses] = useState<AppConstantType[]>();

  const [ticket, setTicket] = useState<ClientTicket>();
  const toast = useRef(null);

  const home = { icon: 'pi pi-home', url: '/' };

  useEffect(() => {
    const ticketNo = new URLSearchParams(window.location.search).get('ticketNo');
    Promise
      .all([
        clientService.getTicket(ticketNo),
        clientService.getServiceCategories(),
        clientService.getServiceStatuses(),
      ])
      .then((resps) => {
        setTicket(resps[0]);
        setCategories(resps[1]);
        setStatuses(resps[2]);
      })
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
        {ticket ? ticket.ticketNo : 'New Request'}
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
    const clone = new ClientTicket(ticket);
    clone[prop] = value;
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
                        <div className="text-500 w-6 md:w-2 font-medium">Summary</div>
                        <InputText id="summary" type="text" value={ticket.summary} onBlur={() => update()} onChange={(e) => changeProp('summary', e.target.value)} />
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Urgency</div>
                        <Rating value={ticket.urgency} onChange={(e) => changeProp('urgency', e.value)} />
                        \
                        {' '}
                      </li>
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
                          value={ticket.serviceCategoryId}
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
                          <InputText id="name" type="text" value={ticket.name} onBlur={() => update()} onChange={(e) => changeProp('name', e.target.value)} />
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Phone</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                          <InputMask
                            id="phone"
                            type="text"
                            mask="(999) 999-9999"
                            value={ticket.phone}
                            onBlur={() => update()}
                            onChange={(e) => changeProp('phone', e.target.value)}
                          />
                        </div>
                      </li>
                      <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                        <div className="text-500 w-6 md:w-2 font-medium">Email</div>
                        <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                          <InputText id="email" type="text" value={ticket.email} onBlur={() => update()} onChange={(e) => changeProp('email', e.target.value)} />
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
