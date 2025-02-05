/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
* ClientDialog.js
*
* @2023 Digital Aid Seattle
*/

import { Dialog } from 'primereact/dialog';
import React, {
  useEffect, useState, useRef, useReducer,
} from 'react';
import {
  ClientInfoActionType, ClientInformationProvider, clientInfoReducer, defaultClientInformation,
} from '@context/serviceRequest/clientInformationContext';
import {
  PetInfoActionType, PetInformationProvider, defaultPetInformation, petInfoReducer,
} from '@context/serviceRequest/petInformationContext';
import {
  ServiceInfoActionType, ServiceInformationProvider, defaultServiceInformation, serviceInfoReducer,
} from '@context/serviceRequest/serviceInformationContext';
import * as DataService from '@services/DataService';
import {
  EditablePetType, EditableClientType, EditableServiceRequestType, ServiceRequestType,
} from '@types';
import FormConfirmationButtons from '@components/FormConfirmationButtons';
import ClientInformationSection from '@components/serviceRequest/ClientInformationSection';
import PetInformationSection from '@components/serviceRequest/PetInformationSection';
import ServiceInformationSection from '@components/serviceRequest/ServiceInformationSection';

interface ClientDialogProps {
  visible: boolean;
  onClose: (request: ServiceRequestType) => void;
}

function ClientDialog(props: ClientDialogProps) {
  const [busy, setBusy] = useState(false);
  const [clientDialog, setClientDialog] = useState(false);

  //* Get state and dispatchers for the from sections
  const [request, requestDispatch] = useReducer(serviceInfoReducer, [defaultServiceInformation]);
  const [client, clientDispatch] = useReducer(clientInfoReducer, defaultClientInformation);
  const [animal, animalDispatch] = useReducer(petInfoReducer, [defaultPetInformation]);

  useEffect(() => {
    setClientDialog(props.visible);
  }, [props]);

  const hideClientDialog = () => {
    props.onClose(undefined);
    clientDispatch({ type: ClientInfoActionType.Clear });
  };

  const saveClientDialog = () => {
    // TODO implement client creation
    requestDispatch({ type: ServiceInfoActionType.Clear });
    clientDispatch({ type: ClientInfoActionType.Clear });
    animalDispatch({ type: PetInfoActionType.Clear });
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
          const clientResponse = await DataService.getClientByIdOrEmail('email', value);

          if (clientResponse !== null) {
            clientDispatch({
              type: ClientInfoActionType.Update,
              partialStateUpdate: {
                first_name: clientResponse.first_name,
                last_name: clientResponse.last_name,
                phone: clientResponse.phone,
                email: clientResponse.email,
              },
            });
          }
        } catch (error) { console.log(error); }
      }, 1000);
    }
  };

  // TODO: check for existing pet and fill out fields
  const updatePetField = (field, value) => {
    // setRequest
  };

  const clientDialogFooter = (
    <FormConfirmationButtons
      disabled={busy}
      saving={busy}
      onCancelClicked={hideClientDialog}
      onSaveClicked={saveClientDialog}
    />
  );

  return (
    <Dialog
      visible={clientDialog}
      style={{ width: '650px' }}
      header="Client Request"
      modal
      className="p-fluid"
      footer={clientDialogFooter}
      onHide={hideClientDialog}
    >
      <div className="col-12 md:col-12">
        <div className="card p-fluid">
          <ClientInformationProvider
            state={client}
            dispatch={clientDispatch}
          >
            <ClientInformationSection
              disabled={busy}
              show={['first_name', 'last_name', 'email', 'phone']}
            />
          </ClientInformationProvider>
          <PetInformationProvider
            state={animal}
            dispatch={animalDispatch}
          >
            <PetInformationSection
              disabled={busy}
              show={['name', 'species']}
            />
          </PetInformationProvider>
          <ServiceInformationProvider
            state={request}
            dispatch={requestDispatch}
          >
            <ServiceInformationSection
              disabled={busy}
              show={['service_category']}
            />
          </ServiceInformationProvider>
        </div>
      </div>
    </Dialog>
  );
}

export default ClientDialog;
