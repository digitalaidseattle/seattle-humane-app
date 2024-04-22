import InputRadio from '@components/InputRadio';
import InputText from '@components/InputText';
import InputTextArea from '@components/InputTextArea';
import { ServiceInfoActionType, ServiceInformationContext, ServiceInformationDispatchContext } from '@context/serviceRequest/serviceInformationContext';
import { EditableRequestType, ServiceRequestSchemaInsert } from '@types';
import { Dropdown } from 'primereact/dropdown';
import { useContext } from 'react';
import { useAppConstants } from 'src/services/useAppConstants';
import { TicketType } from '@lib';

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
  AssignTo: 'Assign to',
};

//* Options for multi-choice controls
export const priorityOptions = [
  serviceInformationLabels.Urgent,
  serviceInformationLabels.NonUrgent,
];

/** Props for the ServiceInformationSection */
interface ServiceInformationSectionProps {
  /** Flag to disable/enable the controls */
  disabled: boolean
  /** Fields to show on the form */
  show?: (keyof ServiceRequestSchemaInsert)[]
}

/**
 *
 * @param props {@link ServiceInformationSectionProps}
 * @returns A controlled form for creating a service request.
 */
export default function ServiceInformationSection(props: ServiceInformationSectionProps) {
  const {
    disabled,
    show = ['service_category', 'priority', 'source', 'description', 'status', 'assigned_to'],
  } = props;

  const visibleFields = new Set<keyof ServiceRequestSchemaInsert>(show);

  //* Retrieve form state from the context
  const formData = useContext(ServiceInformationContext);
  const dispatch = useContext(ServiceInformationDispatchContext);

  const { data: sources } = useAppConstants('source');
  const { data: statuses } = useAppConstants('status');
  const { data: categories } = useAppConstants('category');

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<ServiceRequestSchemaInsert>) => dispatch(
    { type: ServiceInfoActionType.Update, partialStateUpdate },
  );
  const setCategory = (service_category: ServiceRequestSchemaInsert['service_category']) => setFormData({ service_category });
  const setPriority = (priority: ServiceRequestSchemaInsert['priority']) => setFormData({ priority });
  const setSource = (source: ServiceRequestSchemaInsert['source']) => setFormData({ source });
  const setServiceDescription = (description: ServiceRequestSchemaInsert['description']) => setFormData({ description });
  const setStatus = (status: ServiceRequestSchemaInsert['status']) => setFormData({ status });
  const setAssignedTo = (assigned_to: ServiceRequestSchemaInsert['assigned_to']) => setFormData({ assigned_to });

  return (
    <div className="grid">
      <div className="col-12">
        <h3>
          {serviceInformationLabels.ServiceDetails}
          :
        </h3>
      </div>
      <div className="col-12 grid row-gap-3 pl-5">
        {visibleFields.has('service_category')
          && (
            <div className="col-6">
              <div className="col-fixed mr-3">{serviceInformationLabels.Category}</div>
              <Dropdown
                id="category"
                value={formData.service_category}
                title={serviceInformationLabels.Category}
                className="w-full md:w-14rem"
                onChange={(e) => setCategory(e.target.value)}
                options={categories}
                disabled={disabled}
              />
            </div>
          )}
        {visibleFields.has('priority')
          && (
            <div className="grid col-6 justify-content-end">
              <div className="flex flex-wrap gap-3">
                {priorityOptions.map((val) => (
                  <InputRadio
                    id={`priority-${val}`}
                    key={val}
                    label={val}
                    value={val}
                    disabled={disabled}
                    name={`priority-${val}`}
                    onChange={(e) => setPriority(e.target.value)}
                    checked={formData.priority === val}
                  />
                ))}
              </div>
            </div>
          )}
        {visibleFields.has('source')
          && (
            <div className="grid col-12">
              <div className="col-fixed mr-3">{serviceInformationLabels.Source}</div>
              <div className="flex flex-wrap gap-3">
                {sources.map((opt) => (
                  <InputRadio
                    id={`source-${opt.value}`}
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                    disabled={disabled}
                    name={`source-${opt.value}`}
                    onChange={(e) => setSource(e.target.value)}
                    checked={formData.source === opt.value}
                  />
                ))}
              </div>
            </div>
          )}
        {visibleFields.has('description')
          && (
            <div className="col-12">
              <InputTextArea
                id="description"
                value={formData.description}
                disabled={disabled}
                label={serviceInformationLabels.ServiceDescription}
                placeholder={serviceInformationLabels.ServiceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                rows={5}
              />
            </div>
          )}
        {visibleFields.has('status')
          && (
            <div className="grid col-6 pr-3">
              <div className="col-fixed mr-3">{serviceInformationLabels.Status}</div>
              <div className="flex flex-wrap gap-3">
                {statuses.map((opt) => (
                  <InputRadio
                    id={`status-${opt.value}`}
                    key={opt.value}
                    label={opt.label}
                    value={opt.value}
                    disabled={disabled}
                    name={`status-${opt.value}`}
                    onChange={(e) => setStatus(e.target.value)}
                    checked={formData.status === opt.value}
                  />
                ))}
              </div>
            </div>
          )}
        {visibleFields.has('assigned_to')
          && (
            <div className="col-6">
              {/* TODO change to <select> element when options are known */}
              <InputText
                id="assigned_to"
                value={formData.assigned_to}
                disabled={disabled}
                label={serviceInformationLabels.AssignTo}
                placeholder={serviceInformationLabels.AssignTo}
                onChange={(e) => setAssignedTo(e.target.value)}
              />
            </div>
          )}
      </div>
    </div>
  );
}
