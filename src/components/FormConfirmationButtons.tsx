/* eslint-disable jsx-quotes */
/* eslint-disable @typescript-eslint/quotes */
import { Button } from 'primereact/button';

interface FormConfirmationButtonsProps {
  /** The label for the Cancel button */
  cancelLabel?: string;
  /** The handler for the Cancel button press */
  onCancelClicked: () => void;
  /** The label for the Save button */
  saveLabel?: string;
  /** The handler for the Save button press */
  onSaveClicked: () => void;
  /** The label for the Edit button */
  editLabel?: string;
  /** The handler for the Edit button press */
  onEditClicked: () => void;
  /** Flag to enable/disable the buttons */
  disabled: boolean;
  /** Whether to show the save button loading state */
  saving: boolean;
  /** Flag to show or hide buttons dynamically */
  showButtons: {
    cancel?: boolean;
    save?: boolean;
    edit?: boolean;
  };
}

/**
 *
 * @param props {@link FormConfirmationButtonsProps}
 * @returns Controlled Cancel and Save button elements
 */

export default function FormConfirmationButtons(
  props: FormConfirmationButtonsProps
) {
  // TODO localize
  // FIXME: isEditing should be a prop and only change when btn is pressed and or successfully saved
  const Labels = {
    Cancel: 'Cancel',
    Save: 'Save',
    Edit: 'Edit',
  };

  const {
    cancelLabel = Labels.Cancel,
    onCancelClicked,
    saveLabel = Labels.Save,
    onSaveClicked,
    editLabel = Labels.Edit,
    onEditClicked,
    disabled,
    saving,
    showButtons = { cancel: true, save: true, edit: true },
  } = props;

  return (
    <>
      {showButtons.cancel && (
        <Button
          label={cancelLabel}
          disabled={disabled}
          icon='pi pi-times'
          className='p-button-text'
          onClick={onCancelClicked}
        />
      )}
      {showButtons.save && (
        <Button
          label={saveLabel}
          disabled={disabled}
          icon='pi pi-check'
          className='p-button-text'
          loading={saving}
          onClick={onSaveClicked}
        />
      )}
      {showButtons.edit && (
        <Button
          label={editLabel}
          disabled={disabled}
          className='p-button-text'
          onClick={onEditClicked}
        />
      )}
    </>
  );
}
