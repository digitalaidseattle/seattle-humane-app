import React, { useContext } from "react";
import InputRadio from "@components/InputRadio";
import InputText from "@components//InputText";
import { ClientInfoActionType, ClientInformationContext, ClientInformationDispatchContext } from "@context/serviceRequest/clientInformationContext";
import { EdiableClientInfo } from "@types";

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
}

//* Options for multi-choice controls
const previouslyUsedOptions = ['Yes', 'No', 'Unsure']

/** Props for the ClientInformationSection */
interface ClientInformationSectionProps {
  /** Flag to disable/enable the controls */
  disabled: boolean
  /** Fields to show on the form */
  show?: (keyof EdiableClientInfo)[]
}

/**
 * 
 * @param props {@link ClientInformationSectionProps}
 * @returns A controlled form for creating a service request.  
 */
export default function ClientInformationSection(props: ClientInformationSectionProps) {
  const {
    disabled,
    show = ['first_name', 'last_name', 'email', 'phone', 'postal_code', 'previously_used']
  } = props

  const visibleFields = new Set<keyof EdiableClientInfo>(show)

  //* Retrieve form state from the context
  const formData = useContext(ClientInformationContext)
  const dispatch = useContext(ClientInformationDispatchContext)

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<EdiableClientInfo>) => dispatch({type: ClientInfoActionType.Update, partialStateUpdate})
  const setFirstName = (first_name: EdiableClientInfo['first_name']) => (setFormData({first_name}))
  const setLastName = (last_name: EdiableClientInfo['last_name']) => (setFormData({last_name}))
  const setEmail = (email: EdiableClientInfo['email']) => (setFormData({email}))
  const setPhone = (phone: EdiableClientInfo['phone']) => (setFormData({phone}))
  const setPostalCode = (postal_code: EdiableClientInfo['postal_code']) => (setFormData({postal_code}))
  const setPreviouslyUsed = (previously_used: EdiableClientInfo['previously_used']) => (setFormData({previously_used}))

  return (
    <>
      <div className="grid">
        <div className="col-12"><h3>{clientInformationLabels.ClientInformation}:</h3></div>
        <div className="col-12 grid row-gap-3 pl-5">
          {visibleFields.has('first_name')
            && <div className="col-6">
              <InputText
                id="firstName"
                value={formData.first_name}
                disabled={disabled}
                label={clientInformationLabels.FirstName}
                placeholder={clientInformationLabels.FirstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>}
          {visibleFields.has('last_name')
            && <div className="col-6">
              <InputText
                id="lastName"
                value={formData.last_name}
                disabled={disabled}
                label={clientInformationLabels.LastName}
                placeholder={clientInformationLabels.LastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>}
          {visibleFields.has('email')
            && <div className="col-6">
              <InputText
                id="email"
                value={formData.email}
                disabled={disabled}
                label={clientInformationLabels.Email}
                placeholder={clientInformationLabels.EmailPlaceholder}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>}
          {visibleFields.has('phone')
            && <div className="col-6">
              <InputText
                id="phone"
                value={formData.phone}
                disabled={disabled}
                label={clientInformationLabels.PhoneNumber}
                placeholder={clientInformationLabels.PhoneNumberPlaceholder}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>}
          {visibleFields.has('postal_code')
            && <div className="col-6">
              <InputText
                id="postal_code"
                value={`${formData.postal_code}`}
                disabled={disabled}
                label={clientInformationLabels.PostalCode}
                placeholder={clientInformationLabels.PostalCodePlaceholder}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>}
          {visibleFields.has('previously_used')
            && <div className="grid col-12">
              <div className="col-fixed mr-3">{clientInformationLabels.PreviouslyUsed}</div>
              <div className="flex flex-wrap gap-3">
                {previouslyUsedOptions.map((val, i) => (
                  <InputRadio
                    key={i}
                    label={val}
                    value={val}
                    disabled={disabled}
                    name={`previouslyUsed-${val}`}
                    onChange={(e) => setPreviouslyUsed(e.target.value)}
                    checked={formData.previously_used === val}
                  />
                ))}
              </div>
            </div>}
        </div>
      </div>
    </>
  )
}