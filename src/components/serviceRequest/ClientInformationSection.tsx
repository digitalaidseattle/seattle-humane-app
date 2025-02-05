/* eslint-disable react/jsx-curly-newline */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable jsx-quotes */
import React, { useContext, useState, useEffect } from 'react';
import InputText from '@components//InputText';
import {
  ClientInfoActionType,
  ClientInformationContext,
  ClientInformationDispatchContext,
} from '@context/serviceRequest/clientInformationContext';
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
  disabled: boolean;
  /** Fields to show on the form */
  show?: (keyof EditableClientType)[];
}

/**
 *
 * @param props {@link ClientInformationSectionProps}
 * @returns A controlled form for creating a service request.
 */
export default function ClientInformationSection(
  props: ClientInformationSectionProps
) {
  const [updatedFirstName, setUpdatedFirstName] = useState(null);
  const [updatedLastName, setUpdatedLastName] = useState(null);
  const [updatedEmail, setUpdatedEmail] = useState(null);
  const [updatedPhone, setUpdatedPhone] = useState(null);
  const [updatedZipCode, setUpdatedZipCode] = useState(null);

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

  const [errors, setErrors] = useState<{ [key in keyof ClientType]?: boolean }>(
    {}
  );
  const setError = (field: string, error: boolean) => {
    setErrors((p) => ({ ...p, [field]: error }));
  };

  //* Retrieve form state from the context
  const formData = useContext(ClientInformationContext);
  const dispatch = useContext(ClientInformationDispatchContext);

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<EditableClientType>) =>
    dispatch({ type: ClientInfoActionType.Update, partialStateUpdate });
  const setFirstName = (first_name: EditableClientType['first_name']) =>
    setFormData({ first_name });
  const setLastName = (last_name: EditableClientType['last_name']) =>
    setFormData({ last_name });
  const setEmail = (email: EditableClientType['email']) =>
    setFormData({ email });
  const setPhone = (phone: EditableClientType['phone']) =>
    setFormData({ phone });
  const setZipCode = (zip_code: EditableClientType['zip_code']) =>
    setFormData({ zip_code });
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
      setError(fieldName, phone.length < 9);
    }
  };

  const handleInputUpdate = (
    field,
    updater,
    setter,
    eventValue = undefined
  ) => {
    console.log(eventValue);
    // first check if an updated value has been provided
    if (eventValue || eventValue === '') {
      updater(eventValue);
      setter(eventValue);

      // console.log('formData: ', formData[field]);
      return eventValue;
    }

    //! this func triggers onChange, it never get to the below code. It never needs to
    // return existing previous data to the form value property
    console.log(formData[field]);
    return formData[field];
  };

  useEffect(() => {
    setUpdatedFirstName(formData.first_name);
    setUpdatedLastName(formData.last_name);
    setUpdatedEmail(formData.email);
    setUpdatedPhone(formData.phone);
    setUpdatedZipCode(formData.zip_code);
  }, [formData]);

  return (
    <div className='grid'>
      <div className='col-12'>
        <h3>{clientInformationLabels.ClientInformation}:</h3>
      </div>
      <div className='col-12 grid row-gap-3 pl-5'>
        {visibleFields.has('first_name') && (
          <div className='col-6'>
            <InputText
              id='first_name'
              value={updatedFirstName}
              disabled={disabled}
              label={clientInformationLabels.FirstName}
              placeholder={clientInformationLabels.FirstName}
              onChange={(e) =>
                handleInputUpdate(
                  'first_name',
                  setUpdatedFirstName,
                  setFirstName,
                  e.target.value
                )
              }
              onBlur={() => validate('first_name')}
              invalid={errors.first_name}
            />
          </div>
        )}
        {visibleFields.has('last_name') && (
          <div className='col-6'>
            <InputText
              id='last_name'
              value={updatedLastName}
              disabled={disabled}
              label={clientInformationLabels.LastName}
              placeholder={clientInformationLabels.LastName}
              onChange={(e) =>
                handleInputUpdate(
                  'last_name',
                  setUpdatedLastName,
                  setLastName,
                  e.target.value
                )
              }
              onBlur={() => validate('last_name')}
              invalid={errors.last_name}
            />
          </div>
        )}
        {visibleFields.has('email') && (
          <div className='col-6'>
            <InputText
              id='email'
              value={updatedEmail}
              disabled={disabled}
              label={clientInformationLabels.Email}
              placeholder={clientInformationLabels.EmailPlaceholder}
              onChange={(e) =>
                handleInputUpdate(
                  'email',
                  setUpdatedEmail,
                  setEmail,
                  e.target.value
                )
              }
              invalid={errors.email}
              onBlur={() => validate('email')}
              helpText={helpText.email}
            />
          </div>
        )}
        {visibleFields.has('phone') && (
          <div className='col-6'>
            <InputText
              id='phone'
              maxLength={9}
              value={updatedPhone}
              disabled={disabled}
              label={clientInformationLabels.PhoneNumber}
              placeholder={clientInformationLabels.PhoneNumberPlaceholder}
              keyfilter='pint'
              onChange={(e) =>
                handleInputUpdate(
                  'phone',
                  setUpdatedPhone,
                  setPhone,
                  e.target.value
                )
              }
              onBlur={() => validate('phone')}
              invalid={errors.phone}
            />
          </div>
        )}
        {visibleFields.has('zip_code') && (
          <div className='col-6'>
            <InputText
              id='zip_code'
              maxLength={5}
              value={`${updatedZipCode}`}
              disabled={disabled}
              label={clientInformationLabels.ZipCode}
              placeholder={clientInformationLabels.ZipCodePlaceholder}
              onChange={(e) =>
                handleInputUpdate(
                  'zip_code',
                  setUpdatedZipCode,
                  setZipCode,
                  e.target.value
                )
              }
              onBlur={() => validate('zip_code')}
              invalid={errors.zip_code}
              keyfilter='pint'
            />
          </div>
        )}
      </div>
    </div>
  );
}
