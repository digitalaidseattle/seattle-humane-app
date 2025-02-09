import { Dialog } from 'primereact/dialog';
import FormConfirmationButtons from '@components/FormConfirmationButtons';
import {
  ClientInformationProvider,
} from '@context/serviceRequest/clientInformationContext';
import {
  PetInformationProvider,
} from '@context/serviceRequest/petInformationContext';
import {
  ServiceInformationProvider,
} from '@context/serviceRequest/serviceInformationContext';
import useServiceRequestForm from '@hooks/useServiceRequestForm';
import type { ServiceRequestType } from '@types';
import ClientInformationSection from '@components/serviceRequest/ClientInformationSection';
import PetInformationSection from '@components/serviceRequest/PetInformationSection';
import ServiceInformationSection from '@components/serviceRequest/ServiceInformationSection';
import { mutate } from 'swr';

// TODO externalize to localization file
export const serviceRequestLabels = {
  FormHeader: 'SPS Internal Form',
};

/** Props for the ServiceRequestDialog */
export interface ServiceRequestDialogProps {
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
    busy, isNewTicket, isReadOnly, setIsReadOnly, save, message, client, pets, tickets,
    clientInformationDispatch, petInformationDispatch, serviceInformationDispatch,
    showDialog,
  } = useServiceRequestForm(ticketId, visible);
  const disabled = busy || isReadOnly;
  const hideDialog = () => {
    onClose();
  };

  const onSaveClicked = async () => {
    const success = await save();
    if (success) {
      mutate('dataservice/alltickets');
      setIsReadOnly(true);
      if (isNewTicket) hideDialog();
    }
  };

  const onEditClicked = () => {
    setIsReadOnly(false);
  };

  const dialogFooter = (
    <FormConfirmationButtons
      disabled={disabled}
      onCancelClicked={hideDialog}
      onSaveClicked={onSaveClicked}
      onEditClicked={onEditClicked}
      editing={!isReadOnly}
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
            state={client}
            dispatch={clientInformationDispatch}
          >
            <ClientInformationSection disabled={disabled} />
            <hr />
          </ClientInformationProvider>
          <PetInformationProvider state={pets} dispatch={petInformationDispatch}>
            <PetInformationSection disabled={disabled} showAddPet={isNewTicket} />
            <hr />
            <ServiceInformationProvider
              state={tickets}
              dispatch={serviceInformationDispatch}
            >
              <ServiceInformationSection disabled={disabled} showAddTicket={isNewTicket} />
            </ServiceInformationProvider>
          </PetInformationProvider>
        </div>
      </div>
    </Dialog>
  );
}

export default ServiceRequestDialog;
