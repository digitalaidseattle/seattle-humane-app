import { useEffect, useReducer, useState } from "react";
import { Dialog } from "primereact/dialog";
import FormConfirmationButtons from "@components/FormConfirmationButtons";
import { ClientInfoActionType, ClientInformationProvider, clientInfoReducer, defaultClientInformation } from "@context/serviceRequest/clientInformationContext";
import { petInfoReducer, defaultPetInformation, PetInfoActionType, PetInformationProvider } from "@context/serviceRequest/petInformationContext";
import { serviceInfoReducer, defaultServiceInformation, ServiceInfoActionType, ServiceInformationProvider } from "@context/serviceRequest/serviceInformationContext";
import ClientInformationSection from "./ClientInformationSection";
import PetInformationSection from "./PetInformationSection";
import ServiceInformationSection from "./ServiceInformationSection";


// TODO externalize to localization file
export const serviceRequestLabels = {
  FormHeader: 'SPS Internal Form',
}

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

  const [showDialog, setShowDialog] = useState(false);
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setShowDialog(props.visible)
  }, [props])

  const hideDialog = () => {
    props.onClose();
  };

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
    hideDialog()
  }

  const save = async () => {
    if (busy) return
    setBusy(true)
    // TODO add error handling scenario
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000))
    setBusy(false)
  }

  const dialogFooter = <FormConfirmationButtons
    disabled={busy}
    onCancelClicked={cancel}
    onSaveClicked={save}
    saving={busy}
  />

  return <Dialog visible={showDialog} style={{ width: '850px' }} header={serviceRequestLabels.FormHeader} modal
    footer={dialogFooter}
    onHide={hideDialog}>
    <div className="col-12 md:col-12">
      <div className="card">
        <ClientInformationProvider state={clientInformationState} dispatch={clientInformationDispatch}>
          <ClientInformationSection disabled={busy} />
        </ClientInformationProvider>
        <PetInformationProvider state={petInformationState} dispatch={petInformationDispatch}>
          <PetInformationSection disabled={busy} />
        </PetInformationProvider>
        <ServiceInformationProvider state={serviceInformationState} dispatch={serviceInformationDispatch}>
          <ServiceInformationSection disabled={busy} />
        </ServiceInformationProvider>
      </div>
    </div>
  </Dialog>
}

export default ServiceRequestDialog;