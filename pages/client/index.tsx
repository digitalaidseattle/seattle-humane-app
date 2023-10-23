import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { ClientTicket, clientService } from '../../client/service/ClientService';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';

const Client = () => {

    const [ticket, setTicket] = useState<ClientTicket>();
    const toast = useRef(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        clientService.getTicket(params.get('ticketNo'))
            .then(data => setTicket(data));
    }, []);


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    {/* <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openClientDialog} /> */}
                    {/* <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" /> */}
                {/* <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} /> */}
            </React.Fragment>
        );
    };

    const changeProp = (prop: string, value: any) => {
        const clone = new ClientTicket(ticket);
        clone[prop] = value;
        setTicket(clone);
    }

    const update = () => {
        clientService.update(ticket)
            .then(t => setTicket(t));
    }

    return (
        <div className="grid flex">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                    {ticket &&
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
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{ticket.summary}</div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Description</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{ticket.description}</div>
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
                                                <InputText id="name" type="text" value={ticket.phone} onBlur={() => update()} onChange={(e) => changeProp('phone', e.target.value)} />
                                            </div>
                                        </li>
                                        <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                            <div className="text-500 w-6 md:w-2 font-medium">Email</div>
                                            <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                                <InputText id="name" type="text" value={ticket.email} onBlur={() => update()} onChange={(e) => changeProp('email', e.target.value)} />
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Client;
