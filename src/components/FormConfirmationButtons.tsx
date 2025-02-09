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
  /** The label for the Edit button */
  editLabel?: string
  /** The handler for the Edit button press */
  onEditClicked?: () => void
  /** Flag to show the edit button */
  editing?: boolean
  /** Flag to enable/disable the buttons */
  disabled: boolean
  /** Whether to show the save button loading state */
  saving: boolean
}

// TODO localize
const Labels = {
  Cancel: 'Cancel',
  Save: 'Save',
  Edit: 'Edit',
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
    editLabel = Labels.Edit, onEditClicked,
    editing = true,
    disabled, saving,
  } = props;
  return (
    editing
      ? (
        <>
          <Button label={cancelLabel} disabled={disabled} icon="pi pi-times" className="p-button-text" onClick={onCancelClicked} />
          <Button label={saveLabel} disabled={disabled} icon="pi pi-check" className="p-button-text" loading={saving} onClick={onSaveClicked} />
        </>
      )
      : <Button label={editLabel} icon="pi pi-pen-to-square" className="p-button-text" onClick={onEditClicked} />
  );
}
