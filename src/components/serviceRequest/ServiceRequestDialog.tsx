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
import ClientInformationSection from './ClientInformationSection';
import PetInformationSection from './PetInformationSection';
import ServiceInformationSection from './ServiceInformationSection';

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
}

/**
 *
 * @returns A dialog with a controlled form for creating a service request.
 */
function ServiceRequestDialog(props: ServiceRequestDialogProps) {
  const { visible, onClose } = props;
  const [showDialog, setShowDialog] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setShowDialog(visible);
  }, [visible]);

  const hideDialog = () => {
    onClose();
  };

  //* Get state and dispatchers for the from sections
  const [
    clientInformationState, clientInformationDispatch,
  ] = useReducer(clientInfoReducer, defaultClientInformation);

  const [
    petInformationState, petInformationDispatch,
  ] = useReducer(petInfoReducer, defaultPetInformation);

  const [
    serviceInformationState, serviceInformationDispatch,
  ] = useReducer(serviceInfoReducer, defaultServiceInformation);

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
        serviceInformationState,
        clientInformationState,
        petInformationState,
      );
      close();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  };

  const dialogFooter = (
    <FormConfirmationButtons
      disabled={busy}
      onCancelClicked={close}
      onSaveClicked={save}
      saving={busy}
    />
  );

  return (
    <Dialog
      data-testid="serviceRequestDialog"
      visible={showDialog}
      style={{ width: '850px' }}
      header={serviceRequestLabels.FormHeader}
      modal
      footer={dialogFooter}
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
            state={clientInformationState}
            dispatch={clientInformationDispatch}
          >
            <ClientInformationSection disabled={busy} />
          </ClientInformationProvider>
          <PetInformationProvider state={petInformationState} dispatch={petInformationDispatch}>
            <PetInformationSection disabled={busy} />
          </PetInformationProvider>
          <ServiceInformationProvider
            state={serviceInformationState}
            dispatch={serviceInformationDispatch}
          >
            <ServiceInformationSection disabled={busy} />
          </ServiceInformationProvider>
        </div>

      </div>
    </Dialog>
  );
}

export default ServiceRequestDialog;
