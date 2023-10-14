/**
* ClientDialog.js
*
* @2023 Digital Aid Seattle
*/

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { RadioButton } from 'primereact/radiobutton';

import { useEffect, useState } from "react";
import { NewClientRequest, TicketType, clientService } from "../service/ClientService";

const ClientDialog = (props) => {

  const [clientDialog, setClientDialog] = useState(false);
  const [type, setType] = useState(TicketType.email)

  useEffect(() => {
    setClientDialog(props.visible)
  }, [props])

  const hideClientDialog = () => {
    props.onClose(undefined);
  };

  const saveClientDialog = () => {
    // TODO fill out request
    const request = new NewClientRequest({
      type: type
    });

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

  return <Dialog visible={clientDialog} style={{ width: '450px' }} header="Client Request" modal className="p-fluid"
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
          <label htmlFor="name3" className="col-12 mb-2 md:col-2 md:mb-0">
            Name
          </label>
          <div className="col-12 md:col-10">
            <InputText id="name3" type="text" />
          </div>
        </div>
        <div className="field grid">
          <label htmlFor="email3" className="col-12 mb-2 md:col-2 md:mb-0">
            Email
          </label>
          <div className="col-12 md:col-10">
            <InputText id="email3" type="text" />
          </div>
        </div>
        <div className="field grid">
          <label htmlFor="phone4" className="col-12 mb-2 md:col-2 md:mb-0">
            Phone
          </label>
          <div className="col-12 md:col-10">
            <InputText id="phone4" type="text" />
          </div>
        </div>


      </div>
    </div>
  </Dialog>
}

export default ClientDialog;