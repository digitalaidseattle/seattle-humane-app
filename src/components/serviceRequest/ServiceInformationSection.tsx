import InputText from '@components/InputText';
import InputTextArea from '@components/InputTextArea';
import { ServiceInfoActionType, ServiceInformationContext, ServiceInformationDispatchContext } from '@context/serviceRequest/serviceInformationContext';
import { ServiceRequestSchemaInsert } from '@types';
import { Dropdown } from 'primereact/dropdown';
import { useContext } from 'react';
import { useAppConstants } from 'src/services/useAppConstants';

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
    show = ['service_category_id', 'request_source_id', 'description', 'team_member_id'],
  } = props;

  const visibleFields = new Set<keyof ServiceRequestSchemaInsert>(show);

  //* Retrieve form state from the context
  const formData = useContext(ServiceInformationContext);
  const dispatch = useContext(ServiceInformationDispatchContext);

  const { data: sources } = useAppConstants('source');
  const { data: categories } = useAppConstants('category');

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<ServiceRequestSchemaInsert>) => dispatch(
    { type: ServiceInfoActionType.Update, partialStateUpdate },
  );
  const setCategory = (service_category_id: ServiceRequestSchemaInsert['service_category_id']) => setFormData({ service_category_id });
  const setSource = (request_source_id: ServiceRequestSchemaInsert['request_source_id']) => setFormData({ request_source_id });
  const setServiceDescription = (description: ServiceRequestSchemaInsert['description']) => setFormData({ description });
  const setAssignedTo = (team_member_id: ServiceRequestSchemaInsert['team_member_id']) => setFormData({ team_member_id });

  return (
    <div className="grid">
      <div className="col-12">
        <h3>
          {serviceInformationLabels.ServiceDetails}
          :
        </h3>
      </div>
      <div className="col-12 grid row-gap-3 pl-5">
        {visibleFields.has('service_category_id')
          && (
            <div className="flex flex-column gap-2 col-6">
              <label htmlFor="service_category_id" className="col-fixed mr-3">{serviceInformationLabels.Category}</label>
              <Dropdown
                id="service_category_id"
                value={formData.service_category_id}
                title={serviceInformationLabels.Category}
                className="w-full md:w-14rem"
                onChange={(e) => setCategory(e.target.value)}
                options={categories}
                disabled={disabled}
              />
            </div>
          )}
        {visibleFields.has('request_source_id')
          && (
            <div className="flex flex-column gap-2 col-6">
              <label htmlFor="request_source_id" className="col-fixed mr-3">{serviceInformationLabels.Source}</label>
              <Dropdown
                id="request_source_id"
                value={formData.request_source_id}
                title={serviceInformationLabels.Source}
                className="w-full md:w-14rem"
                onChange={(e) => setSource(e.target.value)}
                options={sources}
                disabled={disabled}
              />
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
        {visibleFields.has('team_member_id')
          && (
            <div className="col-6">
              {/* TODO change to <select> element when options are known */}
              <InputText
                id="assigned_to"
                value={formData.team_member_id}
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
