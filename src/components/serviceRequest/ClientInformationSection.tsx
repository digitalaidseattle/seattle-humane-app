import React, { useContext } from 'react';
import InputText from '@components//InputText';
import { ClientInfoActionType, ClientInformationContext, ClientInformationDispatchContext } from '@context/serviceRequest/clientInformationContext';
import { EditableClientType } from '@types';

// TODO externalize to localization file
export const clientInformationLabels = {
  ClientInformation: 'Client Information',
  FirstName: 'First Name',
  LastName: 'Last Name',
  Email: 'Email',
  EmailPlaceholder: 'Email@email.com',
  PhoneNumber: 'Phone Number',
  PhoneNumberPlaceholder: '000-000-0000',
  PostalCode: 'Zip Code',
  PostalCodePlaceholder: '00000',
  PreviouslyUsed: 'Previous Services Used?',
};

//* Options for multi-choice controls
export const previouslyUsedOptions = ['Yes', 'No', 'Unsure'];

/** Props for the ClientInformationSection */
interface ClientInformationSectionProps {
  /** Flag to disable/enable the controls */
  disabled: boolean
  /** Fields to show on the form */
  show?: (keyof EditableClientType)[]
}

/**
 *
 * @param props {@link ClientInformationSectionProps}
 * @returns A controlled form for creating a service request.
 */
export default function ClientInformationSection(props: ClientInformationSectionProps) {
  const {
    disabled,
    show = ['first_name', 'last_name', 'email', 'phone', 'zip_code'],
  } = props;

  const visibleFields = new Set<keyof EditableClientType>(show);

  //* Retrieve form state from the context
  const formData = useContext(ClientInformationContext);
  const dispatch = useContext(ClientInformationDispatchContext);

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<EditableClientType>) => dispatch(
    { type: ClientInfoActionType.Update, partialStateUpdate },
  );
  const setFirstName = (first_name: EditableClientType['first_name']) => (setFormData({ first_name }));
  const setLastName = (last_name: EditableClientType['last_name']) => (setFormData({ last_name }));
  const setEmail = (email: EditableClientType['email']) => (setFormData({ email }));
  const setPhone = (phone: EditableClientType['phone']) => (setFormData({ phone }));
  const setPostalCode = (zip_code: EditableClientType['zip_code']) => (setFormData({ zip_code }));

  return (
    <div className="grid">
      <div className="col-12">
        <h3>
          {clientInformationLabels.ClientInformation}
          :
        </h3>
      </div>
      <div className="col-12 grid row-gap-3 pl-5">
        {visibleFields.has('first_name')
          && (
            <div className="col-6">
              <InputText
                id="first_name"
                value={formData.first_name}
                disabled={disabled}
                label={clientInformationLabels.FirstName}
                placeholder={clientInformationLabels.FirstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          )}
        {visibleFields.has('last_name')
          && (
            <div className="col-6">
              <InputText
                id="last_name"
                value={formData.last_name}
                disabled={disabled}
                label={clientInformationLabels.LastName}
                placeholder={clientInformationLabels.LastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          )}
        {visibleFields.has('email')
          && (
            <div className="col-6">
              <InputText
                id="email"
                value={formData.email}
                disabled={disabled}
                label={clientInformationLabels.Email}
                placeholder={clientInformationLabels.EmailPlaceholder}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
        {visibleFields.has('phone')
          && (
            <div className="col-6">
              <InputText
                id="phone"
                value={formData.phone}
                disabled={disabled}
                label={clientInformationLabels.PhoneNumber}
                placeholder={clientInformationLabels.PhoneNumberPlaceholder}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}
        {visibleFields.has('zip_code')
          && (
            <div className="col-6">
              <InputText
                id="zip_code"
                value={`${formData.zip_code}`}
                disabled={disabled}
                label={clientInformationLabels.PostalCode}
                placeholder={clientInformationLabels.PostalCodePlaceholder}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          )}
      </div>
    </div>
  );
}
