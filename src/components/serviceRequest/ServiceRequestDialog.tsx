/* eslint-disable @typescript-eslint/quotes */
import { Dialog } from 'primereact/dialog';
import FormConfirmationButtons from '@components/FormConfirmationButtons';
import { ClientInformationProvider } from '@context/serviceRequest/clientInformationContext';
import { PetInformationProvider } from '@context/serviceRequest/petInformationContext';
import { ServiceInformationProvider } from '@context/serviceRequest/serviceInformationContext';
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
  visible: boolean;
  /** Callback for the hide dialog button */
  onClose: () => void;
  /** The ID of the ticket */
  ticketId: ServiceRequestType['id'];
}

/**
 *
 * @returns A dialog with a controlled form for creating a service request.
 */
function ServiceRequestDialog({
  visible,
  onClose,
  ticketId,
}: ServiceRequestDialogProps) {
  const {
    disabled,
    readOnly,
    clearForm,
    save,
    message,
    client,
    pet,
    ticket,
    clientInformationDispatch,
    petInformationDispatch,
    serviceInformationDispatch,
  } = useServiceRequestForm(ticketId);

  const [editMode, setEditMode] = useState(false);

  // TODO delete console log
  // console.log('disabled value: ' + disabled);
  // console.log(client);
  // console.log(pet);
  // console.log(ticket);

  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setShowDialog(visible);
  }, [visible]);

  const hideDialog = () => {
    clearForm();
    onClose();
    setEditMode(false);
  };

  const onSaveClicked = async () => {
    const success = await save();
    if (success) {
      mutate('dataservice/alltickets');
      hideDialog();
      // if save successful, exit edit mode
      setEditMode(false);
    }
  };

  const onEditClicked = () => {
    if (editMode) {
      // set readOnly to false?
      // add logic for updating form inputs...

      // save form & close window
      onSaveClicked();
      // console.log(client);
    } else {
      setEditMode(true);
    }
  };

  const isNewRequest = (obj: any): boolean => {
    /* Check for client.id, this differentiates
    an open case from a new request */

    if (obj.id) {
      return false;
    }
    return true;
  };

  const dialogFooter = (
    <FormConfirmationButtons
      disabled={false}
      saving={disabled}
      onCancelClicked={hideDialog}
      onSaveClicked={onSaveClicked}
      onEditClicked={onEditClicked}
      showButtons={{
        cancel: isNewRequest(client),
        save: isNewRequest(client),
        edit: !isNewRequest(client),
      }}
      editLabel={editMode ? 'Save' : 'Edit'}
    />
  );

  return (
    <Dialog
      data-testid='serviceRequestDialog'
      visible={showDialog}
      style={{ width: '850px' }}
      header={serviceRequestLabels.FormHeader}
      modal
      // footer={!readOnly && dialogFooter}
      footer={dialogFooter}
      onHide={hideDialog}
    >
      <div className='col-12 md:col-12'>
        <div className='card'>
          {message && <h3 className='text-red-500'>{message}</h3>}

          {/* // ^ Here is where you will toggle form inputs to editable */}
          <ClientInformationProvider
            state={client}
            dispatch={clientInformationDispatch}
          >
            <ClientInformationSection
              disabled={!editMode && !isNewRequest(client)}
            />
          </ClientInformationProvider>
          <PetInformationProvider state={pet} dispatch={petInformationDispatch}>
            <PetInformationSection
              disabled={!editMode && !isNewRequest(client)}
            />
          </PetInformationProvider>
          <ServiceInformationProvider
            state={ticket}
            dispatch={serviceInformationDispatch}
          >
            <ServiceInformationSection
              disabled={!editMode && !isNewRequest(client)}
            />
          </ServiceInformationProvider>
        </div>
      </div>
    </Dialog>
  );
}

export default ServiceRequestDialog;
