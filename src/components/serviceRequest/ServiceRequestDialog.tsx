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
import { useState, useEffect } from 'react';
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
    disabled, readOnly, clearForm, save, message, client, pet, ticket,
    clientInformationDispatch, petInformationDispatch, serviceInformationDispatch,
  } = useServiceRequestForm(ticketId);

  // TODO delete console log
  console.log('disabled value: ' + disabled);
  console.log(client);
  // console.log(pet);
  // console.log(ticket);

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setShowDialog(visible);
  }, [visible]);

  const hideDialog = () => {
    clearForm();
    onClose();
  };

  const onSaveClicked = async () => {
    const success = await save();
    if (success) {
      mutate('dataservice/alltickets');
      hideDialog();
    }
  };

  const onEditClicked = () => {
    // TODO: add edit logic, set readOnly to false
    // eslint-disable-next-line no-alert
    alert('edit btn clicked');
  };

  const checkForExistingData = () => {
    // if there is data present, show edit btn
  };

  // ! Edit btn should only appear in Dialog that has existing data
  // ! Cancel and Save btns should appear only in a new request
  const dialogFooter = (
    // FIXME: only show the Edit btn on forms with data
    <FormConfirmationButtons
      disabled={disabled}
      onCancelClicked={hideDialog}
      onSaveClicked={onSaveClicked}
      onEditClicked={onEditClicked}
      saving={disabled}
      showButtons={{ cancel: true, save: true, edit: true }}
    />
  );

  return (
    <Dialog
      data-testid="serviceRequestDialog"
      visible={showDialog}
      style={{ width: '850px' }}
      header={serviceRequestLabels.FormHeader}
      modal
      // footer={!readOnly && dialogFooter}
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
            {/* // ! Here is where you will toggle form inputs to editable */}
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

export default ServiceRequestDialog;
