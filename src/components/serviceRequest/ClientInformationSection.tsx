import React, { useContext, useState } from 'react';
import InputText from '@components//InputText';
import { ClientInfoActionType, ClientInformationContext, ClientInformationDispatchContext } from '@context/serviceRequest/clientInformationContext';
import { ClientType, EditableClientType } from '@types';
import emailIsValid from '@utils/dataValidationUtils';

// TODO externalize to localization file
export const clientInformationLabels = {
  ClientInformation: 'Client Information',
  FirstName: 'First Name',
  LastName: 'Last Name',
  Email: 'Email',
  EmailPlaceholder: 'Email@email.com',
  PhoneNumber: 'Phone Number',
  PhoneNumberPlaceholder: '123-123-1234',
  ZipCode: 'Zip Code',
  ZipCodePlaceholder: '12345',
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

  const helpText = {
    email: (
      <ul>
        <li>Email must follow this format: example@domain.com</li>
        <li>Email can&apos;t contain any spaces</li>
        <li>Email can&apos;t be empty</li>
      </ul>
    ),
  };
  const visibleFields = new Set<keyof EditableClientType>(show);

  const [errors, setErrors] = useState<{ [key in keyof ClientType]?: boolean }>({});
  const setError = (field: string, error: boolean) => {
    setErrors((p) => ({ ...p, [field]: error }));
  };

  //* Retrieve form state from the context
  const formData = useContext(ClientInformationContext);
  const dispatch = useContext(ClientInformationDispatchContext);

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<EditableClientType>) => dispatch(
    { type: ClientInfoActionType.Update, partialStateUpdate },
  );
  const setFirstName = (first_name: EditableClientType['first_name']) => {
    setFormData({ first_name });
  };
  const setLastName = (last_name: EditableClientType['last_name']) => (setFormData({ last_name }));
  const setEmail = (email: EditableClientType['email']) => (setFormData({ email }));
  const setPhone = (phone: EditableClientType['phone']) => (setFormData({ phone }));
  const setZipCode = (zip_code: EditableClientType['zip_code']) => (setFormData({ zip_code }));
  const validate = (fieldName: string) => {
    if (fieldName === 'email') {
      const { email } = formData;
      setError(fieldName, !emailIsValid(email));
    }
    // empty field check
    if (['first_name', 'last_name'].includes(fieldName)) {
      const name = formData[fieldName];
      setError(fieldName, !name);
    }
    if (fieldName === 'zip_code') {
      const zip = formData.zip_code;
      setError(fieldName, zip.length < 5);
    }
    if (fieldName === 'phone') {
      const { phone } = formData;
      setError(fieldName, phone.length < 10);
    }
  };

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
                onBlur={() => validate('first_name')}
                invalid={errors.first_name}
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
                onBlur={() => validate('last_name')}
                invalid={errors.last_name}
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
                invalid={errors.email}
                onBlur={() => validate('email')}
                helpText={helpText.email}
              />
            </div>
          )}
        {visibleFields.has('phone')
          && (
            <div className="col-6">
              <InputText
                id="phone"
                maxLength={10}
                value={formData.phone}
                disabled={disabled}
                label={clientInformationLabels.PhoneNumber}
                placeholder={clientInformationLabels.PhoneNumberPlaceholder}
                keyfilter="pint"
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => validate('phone')}
                invalid={errors.phone}
              />
            </div>
          )}
        {visibleFields.has('zip_code')
          && (
            <div className="col-6">
              <InputText
                id="zip_code"
                maxLength={5}
                value={`${formData.zip_code}`}
                disabled={disabled}
                label={clientInformationLabels.ZipCode}
                placeholder={clientInformationLabels.ZipCodePlaceholder}
                onChange={(e) => setZipCode(e.target.value)}
                onBlur={() => validate('zip_code')}
                invalid={errors.zip_code}
                keyfilter="pint"
              />
            </div>
          )}
      </div>
    </div>
  );
}
