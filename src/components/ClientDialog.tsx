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
import { AnimalType, ClientType, RequestType } from "../types";

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

const defaultRequest: RequestType = {
  id: null,
  client_id: null,
  animal_id: null,
  service_category: '',
  source: '',
  staff_id: null,
}

const ClientDialog = (props) => {

  const [clientDialog, setClientDialog] = useState(false);
  const [source, setSource] = useState(TicketType.email);
  const [request, setRequest] = useState<RequestType>(defaultRequest);
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

    setRequest(prevRequest => ({...prevRequest, source: source}));
    clientService.newRequest(request, client, animal)
      .then(requestResponse => props.onClose(requestResponse))
      // TODO - handle all sorts of errors: client exists, animal exists, request exists, etc.
      .catch(err => props.onClose(null))
    setRequest(defaultRequest);
    setClient(defaultClient);
    setAnimal(defaultAnimal);
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
                <RadioButton inputId={`t${index}`} name={t} value={t} onChange={(e) => setSource(e.value)} checked={source === t} />
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
              Animal Name
            </label>
            <div className="col-12 md:col-10">
              <InputText id="summary" type="text" 
                onChange={(e) => setAnimal(prevAnimal => ({...prevAnimal, name: e.target.value}))}
              />
            </div>
          </div>
          <div className="field grid">
            <label htmlFor="summary" className="col-12 mb-2 md:col-2 md:mb-0">
              Animal Species
            </label>
            <div className="col-12 md:col-10">
              <InputText id="summary" type="text" 
                onChange={(e) => setAnimal(prevAnimal => ({...prevAnimal, species: e.target.value}))}
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
        </div>
      </div>
    </Dialog>
  )
}

export default ClientDialog;