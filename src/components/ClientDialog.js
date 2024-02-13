/**
* ClientDialog.js
*
* @2023 Digital Aid Seattle
*/

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { RadioButton } from 'primereact/radiobutton';
import { InputTextarea } from 'primereact/inputtextarea';

import { useEffect, useState } from "react";
import { NewClientRequest, TicketType, clientService } from "../services/ClientService";

const ClientDialog = (props) => {

  const [clientDialog, setClientDialog] = useState(false);
  const [type, setType] = useState(TicketType.email);
  const [request, setRequest] = useState(new NewClientRequest({}));

  useEffect(() => {
    setClientDialog(props.visible)
  }, [props])

  const hideClientDialog = () => {
    props.onClose(undefined);
  };

  const saveClientDialog = () => {
    // type handle separate to support RadioButton
    request.type = type;
    clientService.newRequest(request)
      .then(ticket => props.onClose(ticket))
      .catch(err => props.onClose(null))
  };

  const clientDialogFooter = (
    <>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideClientDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveClientDialog} />
    </>
  );

  return <Dialog visible={clientDialog} style={{ width: '650px' }} header="Client Request" modal className="p-fluid"
    footer={clientDialogFooter}
    onHide={hideClientDialog}>
    <div className="col-12 md:col-12">
      <div className="card p-fluid">
        <div className="field grid flex flex-wrap gap-3">
          {Object.keys(TicketType).map((t, index) =>
            <div key={index} className="flex align-items-center">
              <RadioButton inputId={`t${index}`} name={t} value={t} onChange={(e) => setType(e.value)} checked={type === t} />
              <label htmlFor={`t${index}`} className="ml-2">{t}</label>
            </div>
          )}
        </div>

        <div className="field grid">
          <label htmlFor="name" className="col-12 mb-2 md:col-2 md:mb-0">
            Name
          </label>
          <div className="col-12 md:col-10">
            <InputText id="name" type="text" onChange={(e) => request.name = e.target.value} />
          </div>
        </div>
        <div className="field grid">
          <label htmlFor="email" className="col-12 mb-2 md:col-2 md:mb-0">
            Email
          </label>
          <div className="col-12 md:col-10">
            <InputText id="email" type="text" onChange={(e) => request.email = e.target.value} />
          </div>
        </div>
        <div className="field grid">
          <label htmlFor="phone" className="col-12 mb-2 md:col-2 md:mb-0">
            Phone
          </label>
          <div className="col-12 md:col-10">
            <InputText id="phone" type="text" onChange={(e) => request.phone = e.target.value} />
          </div>
        </div>

        <div className="field grid">
          <label htmlFor="summary" className="col-12 mb-2 md:col-2 md:mb-0">
            Summary
          </label>
          <div className="col-12 md:col-10">
            <InputText id="summary" type="text" onChange={(e) => request.summary = e.target.value} />
          </div>
        </div>
        <div className="field grid">
          <label htmlFor="description" className="col-12 mb-2 md:col-2 md:mb-0">
            Description
          </label>
          <div className="col-12 md:col-10">
            <InputTextarea id="description" type="text" onChange={(e) => request.description = e.target.value} />
          </div>
        </div>
      </div>
    </div>
  </Dialog>
}

export default ClientDialog;