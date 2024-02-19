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

import React, { useEffect, useState, useRef} from "react";
import { NewClientRequest, TicketType, clientService } from "../services/ClientService";
import { AnimalType, ClientType } from "../types";

const ClientDialog = (props) => {

  const defaultClient: ClientType = {
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  }

  const defaultAnimal: AnimalType = {
    id: null,
    name: '',
    species: '',
    client_id: null,
  }

  const [clientDialog, setClientDialog] = useState(false);
  const [type, setType] = useState(TicketType.email);
  const [request, setRequest] = useState(new NewClientRequest({}));
  const [client, setClient] = useState<ClientType>(defaultClient);
  const [animal, setAnimal] = useState<AnimalType>(defaultAnimal);

  useEffect(() => {
    setClientDialog(props.visible)
  }, [props])
  
  const hideClientDialog = () => {
    props.onClose(undefined);
    setClient(defaultClient);
  };
  
  const saveClientDialog = () => {
    // type handle separate to support RadioButton
    setRequest(prevRequest => ({...prevRequest, type: type}));
    clientService.newRequest(request)
    .then(ticket => props.onClose(ticket))
    .catch(err => props.onClose(null))
    setRequest(new NewClientRequest({}));
    setClient(defaultClient);
  };

  const timeoutId = useRef(null);

  const autoFillClient = (type: string, value: string) => {

    // REVIEW: This could also be solved with an onBlur call, so that the check
    // against the DB only happens when user leaves the email field.
    if (type === 'email') {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      // The request to DB for client will trigger 1sec after staff stops typing
      timeoutId.current = setTimeout(async () => {
        try {
          const clientResponse = await clientService.getClientByEmail(value)
          console.log(clientResponse)
          setClient(prevClient => {
            return {
              ...prevClient,
              first_name: clientResponse.first_name || client.first_name,
              last_name: clientResponse.last_name || client.last_name,
              phone: clientResponse.phone || client.phone,
            }
          })
        } catch (error) {}
      }, 1000);

    }
  };

  const updatePetField = (field, value) => {
    setRequest
  }

  const clientDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideClientDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveClientDialog} />
    </React.Fragment>
  );

  return (
    <Dialog visible={clientDialog} style={{ width: '650px' }} header="Client Request" modal className="p-fluid"
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
              First name
            </label>
            <div className="col-12 md:col-10">
              <InputText id="firstName" type="text" 
                value={client.first_name}
                onChange={(e) => setClient(prevClient => ({...prevClient, first_name: e.target.value}))}
              />
            </div>
          </div>
          <div className="field grid">
            <label htmlFor="name" className="col-12 mb-2 md:col-2 md:mb-0">
              Last name
            </label>
            <div className="col-12 md:col-10">
              <InputText id="lastName" type="text" 
                value={client.last_name}
                onChange={(e) => setClient(prevClient => ({...prevClient, last_name: e.target.value}))} 
              />
            </div>
          </div>
          <div className="field grid">
            <label htmlFor="email" className="col-12 mb-2 md:col-2 md:mb-0">
              Email
            </label>
            <div className="col-12 md:col-10">
              <InputText id="email" type="text"
                onChange={(e) => {
                  setClient(prevClient => ({...prevClient, email: e.target.value}));
                  autoFillClient('email', e.target.value);
                }} 
              />
            </div>
          </div>
          <div className="field grid">
            <label htmlFor="phone" className="col-12 mb-2 md:col-2 md:mb-0">
              Phone
            </label>
            <div className="col-12 md:col-10">
              <InputText id="phone" type="text" 
                onChange={(e) => setClient(prevClient => ({...prevClient, phone: e.target.value}))} 
              />
            </div>
          </div>
          <div className="field grid">
            <label htmlFor="summary" className="col-12 mb-2 md:col-2 md:mb-0">
              Pet Name
            </label>
            <div className="col-12 md:col-10">
              <InputText id="summary" type="text" 
                onChange={(e) => setAnimal(prevAnimal => ({...prevAnimal, name: e.target.value}))}
              />
            </div>
          </div>
          <div className="field grid">
            <label htmlFor="summary" className="col-12 mb-2 md:col-2 md:mb-0">
              Service Category
            </label>
            <div className="col-12 md:col-10">
              <InputText id="summary" type="text" 
                onChange={(e) => setRequest(prevRequest => ({...prevRequest, serviceCategory: e.target.value}))}
              />
            </div>
          </div>
          {/* <div className="field grid">
            <label htmlFor="description" className="col-12 mb-2 md:col-2 md:mb-0">
              Description
            </label>
            <div className="col-12 md:col-10">
              <InputTextarea id="description" type="text" 
                onChange={(e) => updateClientField('description', e.target.value)} 
              />
            </div>
          </div> */}
        </div>
      </div>
    </Dialog>
  )
}

export default ClientDialog;