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
  /** The label for the Close button */
  closeLabel?: string;
  /** The handler for the Close button press */
  onCloseClicked: () => void;
  /** Flag to enable/disable the buttons */
  disabled: boolean;
  /** Whether to show the save button loading state */
  saving: boolean;
  /** Flag to show or hide buttons dynamically */
  showButtons: {
    cancel?: boolean;
    save?: boolean;
    edit?: boolean;
    close?: boolean;
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
    Close: 'Close',
  };

  const {
    cancelLabel = Labels.Cancel,
    onCancelClicked,
    saveLabel = Labels.Save,
    onSaveClicked,
    editLabel = Labels.Edit,
    onEditClicked,
    closeLabel = Labels.Close,
    onCloseClicked,
    disabled,
    saving,
    showButtons = { cancel: true, save: true, edit: true, close: true },
  } = props;

  return (
    <>
      {showButtons.cancel && (
        <Button
          label={cancelLabel}
          disabled={disabled}
          // icon='pi pi-times'
          outlined
          // className='p-button-text'
          onClick={onCancelClicked}
        />
      )}
      {showButtons.save && (
        <Button
          label={saveLabel}
          // icon='pi pi-check'
          outlined
          // className='p-button-text'
          loading={saving}
          onClick={onSaveClicked}
        />
      )}
      {showButtons.close && (
        <Button
          label={closeLabel}
          disabled={disabled}
          outlined
          // className='p-button-text'
          onClick={onCloseClicked}
        />
      )}
      {showButtons.edit && (
        <Button
          label={editLabel}
          disabled={disabled}
          outlined
          // className='p-button-text'
          onClick={onEditClicked}
        />
      )}
    </>
  );
}
