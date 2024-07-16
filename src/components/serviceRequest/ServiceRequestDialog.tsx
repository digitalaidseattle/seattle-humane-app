import { useEffect, useReducer, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import FormConfirmationButtons from '@components/FormConfirmationButtons';
import {
  ClientInfoActionType, ClientInformationProvider, clientInfoReducer, defaultClientInformation,
} from '@context/serviceRequest/clientInformationContext';
import {
  petInfoReducer, defaultPetInformation, PetInfoActionType, PetInformationProvider,
} from '@context/serviceRequest/petInformationContext';
import {
  serviceInfoReducer, defaultServiceInformation, ServiceInfoActionType, ServiceInformationProvider,
} from '@context/serviceRequest/serviceInformationContext';
import { clientService } from 'src/services/ClientService';
import { ServiceRequestType } from '@types';
import useTicketById from '@hooks/useTicketById';
import ClientInformationSection from '@components/serviceRequest/ClientInformationSection';
import PetInformationSection from '@components/serviceRequest/PetInformationSection';
import ServiceInformationSection from '@components/serviceRequest/ServiceInformationSection';

// TODO externalize to localization file
export const serviceRequestLabels = {
  FormHeader: 'SPS Internal Form',
};

/** Props for the ServiceRequestDialog */
interface ServiceRequestDialogProps {
  /** Flag to show/hide the modal */
  visible: boolean
  /** Callback for the hide dialog button */
  onClose: () => void
  /** The ID of the ticket */
  ticketId: ServiceRequestType['id']
}

/**
 *
 * @returns A dialog with a controlled form for creating a service request.
 */
function ServiceRequestDialog({ visible, onClose, ticketId }: ServiceRequestDialogProps) {
  const {
    disabled, readOnly, close, save, message, showDialog, hideDialog, client, pet, ticket,
    clientInformationDispatch, petInformationDispatch, serviceInformationDispatch,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
  } = useServiceRequestDialogState({ visible, onClose, ticketId });

  const dialogFooter = (
    <FormConfirmationButtons
      disabled={disabled}
      onCancelClicked={close}
      onSaveClicked={save}
      saving={disabled}
    />
  );

  return (
    <Dialog
      data-testid="serviceRequestDialog"
      visible={showDialog}
      style={{ width: '850px' }}
      header={serviceRequestLabels.FormHeader}
      modal
      footer={!readOnly && dialogFooter}
      onHide={hideDialog}
    >
      <div className="col-12 md:col-12">
        <div className="card">
          {message && (
            <h3 className="text-red-500">
              {message}
            </h3>
          )}
          <ClientInformationProvider
            state={client}
            dispatch={clientInformationDispatch}
          >
            <ClientInformationSection disabled={disabled} />
          </ClientInformationProvider>
          <PetInformationProvider state={pet} dispatch={petInformationDispatch}>
            <PetInformationSection disabled={disabled} />
          </PetInformationProvider>
          <ServiceInformationProvider
            state={ticket}
            dispatch={serviceInformationDispatch}
          >
            <ServiceInformationSection disabled={disabled} />
          </ServiceInformationProvider>
        </div>

      </div>
    </Dialog>
  );
}

function useServiceRequestDialogState({ visible, onClose, ticketId }: ServiceRequestDialogProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const { client: savedClient, animal: savedAnimal, ticket: savedTicket } = useTicketById(ticketId);

  useEffect(() => {
    setShowDialog(visible);
  }, [visible]);

  const hideDialog = () => {
    onClose();
  };

  //* Get state and dispatchers for the from sections
  const [
    newClient, clientInformationDispatch,
  ] = useReducer(clientInfoReducer, defaultClientInformation);

  const [
    newPet, petInformationDispatch,
  ] = useReducer(petInfoReducer, defaultPetInformation);

  const [
    newTicket, serviceInformationDispatch,
  ] = useReducer(serviceInfoReducer, defaultServiceInformation);

  const dataState = { client: newClient, pet: newPet, ticket: newTicket };
  if (ticketId) {
    if (!readOnly) setReadOnly(true);
    dataState.client = savedClient;
    dataState.pet = savedAnimal;
    dataState.ticket = savedTicket;
  } else {
    if (readOnly) setReadOnly(false);
    dataState.client = newClient;
    dataState.pet = newPet;
    dataState.ticket = newTicket;
  }

  const close = () => {
    //* Clear form data
    clientInformationDispatch({ type: ClientInfoActionType.Clear });
    petInformationDispatch({ type: PetInfoActionType.Clear });
    serviceInformationDispatch({ type: ServiceInfoActionType.Clear });
    setMessage('');
    hideDialog();
  };

  const save = async () => {
    if (busy) return;
    setBusy(true);
    // TODO add error handling scenario
    try {
      await clientService.newRequest(
        newTicket,
        newClient,
        newPet,
      );
      close();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  };

  return {
    readOnly,
    disabled: readOnly || busy,
    close,
    save,
    showDialog,
    hideDialog,
    message,
    clientInformationDispatch,
    petInformationDispatch,
    serviceInformationDispatch,
    ...dataState,
  };
}

export default ServiceRequestDialog;
