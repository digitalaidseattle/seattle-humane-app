import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
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
import type { ServiceRequestType, PetInformationType } from '@types';
import ClientInformationSection from '@components/serviceRequest/ClientInformationSection';
import PetInformationSection from '@components/serviceRequest/PetInformationSection';
import ServiceInformationSection from '@components/serviceRequest/ServiceInformationSection';
import { mutate } from 'swr';

// TODO externalize to localization file
export const serviceRequestLabels = {
  FormHeader: 'SPS Internal Form',
  AddPet: 'Add Another Pet',
  RemovePet: 'Remove Pet',
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

function ServiceRequestDialog({ visible, onClose, ticketId }: ServiceRequestDialogProps) {
  const {
    disabled, readOnly, clearForm, save, message, client, pet, ticket,
    clientInformationDispatch, petInformationDispatch, serviceInformationDispatch,
  } = useServiceRequestForm(ticketId);

  const [showDialog, setShowDialog] = useState(false);
  const [pets, setPets] = useState<PetInformationType[]>([]);

  useEffect(() => {
    setShowDialog(visible);
  }, [visible]);

  useEffect(() => {
    if (pet) {
      setPets([pet]);
    }
  }, [pet]);

  const hideDialog = useCallback(() => {
    clearForm();
    setPets([]);
    onClose();
  }, [clearForm, onClose]);

  const onSaveClicked = useCallback(async () => {
    const success = await save();
    if (success) {
      await mutate('dataservice/alltickets');
      hideDialog();
    }
  }, [save, hideDialog]);

  const addPet = useCallback(() => {
    setPets((prevPets) => [...prevPets, { ...pet, id: `new-pet-${prevPets.length}` }]);
  }, [pet]);

  const removePet = useCallback((index: number) => {
    setPets((prevPets) => prevPets.filter((_, i) => i !== index));
  }, []);

  const dialogFooter = (
    <FormConfirmationButtons
      disabled={disabled}
      onCancelClicked={hideDialog}
      onSaveClicked={onSaveClicked}
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
          {pets.map((petInfo, index) => (
            <div key={petInfo.id || index} className="relative mb-4">
              <PetInformationProvider
                state={petInfo}
                dispatch={(action) => petInformationDispatch(action, index)}
              >
                <PetInformationSection disabled={disabled} />
              </PetInformationProvider>
              {pets.length > 1 && (
                <Button
                  icon="pi pi-times"
                  onClick={() => removePet(index)}
                  className="p-button-rounded p-button-danger p-button-text absolute top-0 right-0"
                  aria-label={serviceRequestLabels.RemovePet}
                />
              )}
            </div>
          ))}
          <Button
            label={serviceRequestLabels.AddPet}
            icon="pi pi-plus"
            onClick={addPet}
            className="p-button-text mt-2 mb-4"
          />
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