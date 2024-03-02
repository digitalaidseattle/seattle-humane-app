import React, { useContext } from "react";
import InputRadio from "@components/InputRadio";
import InputText from "@components/InputText";
import InputTextArea from "@components/InputTextArea";
import { ServiceInfoActionType, ServiceInformationContext, ServiceInformationDispatchContext } from "@context/serviceRequest/serviceInformationContext";
import { EditableRequestType } from "@types";
import { TicketType } from "../../services/ClientService";

// TODO externalize to localization file
export const serviceInformationLabels = {
  ServiceDetails: 'Service Details',
  Category: 'Category',
  Urgent: 'Urgent',
  NonUrgent: 'Non-urgent',
  Source: 'Source',
  Email: 'Email',
  Phone: 'Phone',
  InPerson: 'In-person',
  ServiceDescription: 'Service Description',
  Status: 'Status',
  Hold: 'Hold',
  InProgress: 'In-Progress',
  Others: 'Others?',
  AssignTo: 'Assign to'
}

//* Options for multi-choice controls
export const priorityOptions = [
  serviceInformationLabels['Urgent'],
  serviceInformationLabels['NonUrgent']
]
export const sourceOptions = {
  [serviceInformationLabels['Email']]: TicketType.email,
  [serviceInformationLabels['Phone']]: TicketType.phone,
  [serviceInformationLabels['InPerson']]: TicketType.walkin
}
export const statusOptions = [
  serviceInformationLabels['Hold'],
  serviceInformationLabels['InProgress'],
  serviceInformationLabels['Others']
]

/** Props for the ServiceInformationSection */
interface ServiceInformationSectionProps {
  /** Flag to disable/enable the controls */
  disabled: boolean
  /** Fields to show on the form */
  show?: (keyof EditableRequestType)[]
}

/**
 * 
 * @param props {@link ServiceInformationSectionProps}
 * @returns A controlled form for creating a service request.  
 */
export default function ServiceInformationSection(props: ServiceInformationSectionProps) {
  const {
    disabled,
    show = ['service_category', 'priority', 'source', 'description', 'status', 'assigned_to']
  } = props

  const visibleFields = new Set<keyof EditableRequestType>(show)

  //* Retrieve form state from the context
  const formData = useContext(ServiceInformationContext)
  const dispatch = useContext(ServiceInformationDispatchContext)

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<EditableRequestType>) => dispatch({type: ServiceInfoActionType.Update, partialStateUpdate})
  const setCategory = (service_category: EditableRequestType['service_category']) => setFormData({service_category})
  const setPriority = (priority: EditableRequestType['priority']) => setFormData({priority})
  const setSource = (source: EditableRequestType['source']) => setFormData({source})
  const setServiceDescription = (description: EditableRequestType['description']) => setFormData({description})
  const setStatus = (status: EditableRequestType['status']) => setFormData({status})
  const setAssignedTo = (assigned_to: EditableRequestType['assigned_to']) => setFormData({assigned_to})

  return (
    <>
      <div className="grid">
        <div className="col-12"><h3>{serviceInformationLabels.ServiceDetails}:</h3></div>
        <div className="col-12 grid row-gap-3 pl-5">
          {visibleFields.has('service_category')
            && <div className="col-6">
              {/* TODO change to <select> element when options are known */}
              <InputText
                id="service_category"
                value={formData.service_category}
                disabled={disabled}
                label={serviceInformationLabels.Category}
                placeholder={serviceInformationLabels.Category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>}
          {visibleFields.has('priority')
            && <div className="grid col-6 justify-content-end">
              <div className="flex flex-wrap gap-3">
                {priorityOptions.map((val, i) => (
                  <InputRadio
                    id={`priority-${val}`}
                    key={i}
                    label={val}
                    value={val}
                    disabled={disabled}
                    name={`priority-${val}`}
                    onChange={(e) => setPriority(e.target.value)}
                    checked={formData.priority === val}
                  />
                ))}
              </div>
            </div>}
          {visibleFields.has('source')
            && <div className="grid col-12">
              <div className="col-fixed mr-3">{serviceInformationLabels.Source}</div>
              <div className="flex flex-wrap gap-3">
                {Object.keys(sourceOptions).map((label, i) => (
                  <InputRadio
                    id={`source-${label}`}
                    key={label}
                    label={label}
                    value={sourceOptions[label]}
                    disabled={disabled}
                    name={`source-${label}`}
                    onChange={(e) => setSource(e.target.value)}
                    checked={formData.source === sourceOptions[label]}
                  />
                ))}
              </div>
            </div>}
          {visibleFields.has('description')
            && <div className="col-12">
              <InputTextArea
                id="description"
                value={formData.description}
                disabled={disabled}
                label={serviceInformationLabels.ServiceDescription}
                placeholder={serviceInformationLabels.ServiceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                rows={5}
              />
            </div>}
          {visibleFields.has('status')
            && <div className="grid col-6 pr-3">
              <div className="col-fixed mr-3">{serviceInformationLabels.Status}</div>
              <div className="flex flex-wrap gap-3">
                {statusOptions.map((val, i) => (
                  <InputRadio
                    id={`status-${val}`}
                    key={i}
                    label={val}
                    value={val}
                    disabled={disabled}
                    name={`status-${val}`}
                    onChange={(e) => setStatus(e.target.value)}
                    checked={formData.status === val}
                  />
                ))}
              </div>
            </div>}
          {visibleFields.has('assigned_to')
            && <div className="col-6">
              {/* TODO change to <select> element when options are known */}
              <InputText
                id="assigned_to"
                value={formData.assigned_to}
                disabled={disabled}
                label={serviceInformationLabels.AssignTo}
                placeholder={serviceInformationLabels.AssignTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
            </div>}
        </div>
      </div>
    </>
  )
}