import { Button } from 'primereact/button';

interface FormConfirmationButtonsProps {
  /** The label for the Cancel button */
  cancelLabel?: string
  /** The handler for the Cancel button press */
  onCancelClicked: () => void
  /** The label for the Save button */
  saveLabel?: string
  /** The handler for the Save button press */
  onSaveClicked: () => void
  /** Flag to enable/disable the buttons */
  disabled: boolean
  /** Whether to show the save button loading state */
  saving: boolean
}

// TODO localize
const Labels = {
  Cancel: 'Cancel',
  Save: 'Save',
};

/**
 *
 * @param props {@link FormConfirmationButtonsProps}
 * @returns Controlled Cancel and Save button elements
 */
export default function FormConfirmationButtons(props: FormConfirmationButtonsProps) {
  const {
    cancelLabel = Labels.Cancel, onCancelClicked,
    saveLabel = Labels.Save, onSaveClicked,
    disabled, saving,
  } = props;
  return (
    <>
      <Button label={cancelLabel} disabled={disabled} icon="pi pi-times" className="p-button-text" onClick={onCancelClicked} />
      <Button label={saveLabel} disabled={disabled} icon="pi pi-check" className="p-button-text" loading={saving} onClick={onSaveClicked} />
    </>
  );
}
