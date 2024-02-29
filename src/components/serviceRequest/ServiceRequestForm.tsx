import React, { useReducer, useState } from "react";
import FormConfirmationButtons from "../FormConfirmationButtons";
import ClientInformationSection, { clientInformationLabels } from "./ClientInformationSection";
import { ClientInfoActionType, ClientInformationProvider, clientInfoReducer, defaultClientInformation } from "../../context/serviceRequest/clientInformationContext";
import { PetInfoActionType, PetInformationProvider, defaultPetInformation, petInfoReducer } from "../../context/serviceRequest/petInformationContext";
import PetInformationSection, { petInformationLabels } from "./PetInformationSection";
import { ServiceInfoActionType, ServiceInformationProvider, defaultServiceInformation, serviceInfoReducer } from "../../context/serviceRequest/serviceInformationContext";
import ServiceInformationSection, { serviceInformationLabels } from "./ServiceInformationSection";

// TODO externalize to localization file
export const serviceRequestLabels = {
  FormHeader: 'SPS Internal Form',
  Cancel: 'Cancel',
  Save: 'Save',
}

/**
 * 
 * @returns A controlled form for creating a service request.  
 */
export default function ServiceRequestForm() {
  const [busy, setBusy] = useState(false)

  //* Get state and dispatchers for the from sections
  const [clientInformationState, clientInformationDispatch] = useReducer(
    clientInfoReducer, defaultClientInformation,
  )
  const [petInformationState, petInformationDispatch] = useReducer(
    petInfoReducer, defaultPetInformation
  )
  const [serviceInformationState, serviceInformationDispatch] = useReducer(
    serviceInfoReducer,
    defaultServiceInformation
  )

  const cancel = () => {
    //* Clear form data
    clientInformationDispatch({ type: ClientInfoActionType.Clear })
    petInformationDispatch({ type: PetInfoActionType.Clear })
    serviceInformationDispatch({ type: ServiceInfoActionType.Clear })
    // TODO Navigate back/close dialog
  }

  const save = async () => {
    if (busy) return
    setBusy(true)
    // TODO add error handling scenario
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000))
    setBusy(false)
  }
  return (
    <div className="grid flex">
      <div className="col-12">
        <div className="card grid row-gap-5">
          <div className="col-12 flex justify-content-center">
            <h2>{serviceRequestLabels.FormHeader}</h2>
          </div>
          <ClientInformationProvider state={clientInformationState} dispatch={clientInformationDispatch}>
            <ClientInformationSection disabled={busy} />
          </ClientInformationProvider>
          <PetInformationProvider state={petInformationState} dispatch={petInformationDispatch}>
            <PetInformationSection disabled={busy} />
          </PetInformationProvider>
          <ServiceInformationProvider state={serviceInformationState} dispatch={serviceInformationDispatch}>
            <ServiceInformationSection disabled={busy} />
          </ServiceInformationProvider>
          <div className="col-12 flex justify-content-end">
            <FormConfirmationButtons
              disabled={busy}
              cancelLabel={serviceRequestLabels.Cancel}
              onCancelClicked={cancel}
              saveLabel={serviceRequestLabels.Save}
              onSaveClicked={save}
              saving={busy}
            />
          </div>
        </div>
      </div>
    </div>
  )
}