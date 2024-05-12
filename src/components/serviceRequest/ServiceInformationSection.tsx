import InputRadio from '@components/InputRadio';
import InputTextArea from '@components/InputTextArea';
import { ServiceInfoActionType, ServiceInformationContext, ServiceInformationDispatchContext } from '@context/serviceRequest/serviceInformationContext';
import { EditableServiceRequestType } from '@types';
import { Dropdown } from 'primereact/dropdown';
import { useContext } from 'react';
import useTeamMembers from 'src/hooks/useTeamMembers';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants } from 'src/constants';

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
  show?: (keyof EditableServiceRequestType)[]
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

  const visibleFields = new Set<keyof EditableServiceRequestType>(show);

  //* Retrieve form state from the context
  const formData = useContext(ServiceInformationContext);
  const dispatch = useContext(ServiceInformationDispatchContext);

  const sources = useAppConstants(AppConstants.Source);
  const categories = useAppConstants(AppConstants.Category);
  const { data: teamMembers } = useTeamMembers();

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<EditableServiceRequestType>) => dispatch(
    { type: ServiceInfoActionType.Update, partialStateUpdate },
  );
  const setCategory = (service_category_id: EditableServiceRequestType['service_category_id']) => setFormData({ service_category_id });
  const setSource = (request_source_id: EditableServiceRequestType['request_source_id']) => setFormData({ request_source_id });
  const setServiceDescription = (description: EditableServiceRequestType['description']) => setFormData({ description });
  const setAssignedTo = (team_member_id: EditableServiceRequestType['team_member_id']) => setFormData({ team_member_id });

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
            <div className="col-6">
              <div className="col-fixed mr-3">{serviceInformationLabels.Category}</div>
              <Dropdown
                id="service_category_id"
                value={formData.service_category_id}
                title={serviceInformationLabels.Category}
                className="w-full md:w-14rem"
                onChange={(e) => setCategory(e.target.value)}
                options={categories.map((opt) => ({ label: opt.label, value: opt.id }))}
                disabled={disabled}
              />
            </div>
          )}
        {visibleFields.has('request_source_id')
          && (
            <div className="grid col-12">
              <div className="col-fixed mr-3">{serviceInformationLabels.Source}</div>
              <div className="flex flex-wrap gap-3">
                {sources.map((opt) => (
                  <InputRadio
                    id={`request_source_id-${opt.value}`}
                    key={opt.value}
                    label={opt.label}
                    value={opt.id}
                    disabled={disabled}
                    name={`request_source_id-${opt.value}`}
                    onChange={(e) => setSource(e.target.value)}
                    checked={formData.request_source_id === opt.id}
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
        {visibleFields.has('team_member_id')
          && (
            <div className="col-6">
              <div className="col-fixed mr-3">{serviceInformationLabels.AssignTo}</div>

              <Dropdown
                id="team_member_id"
                value={formData.team_member_id}
                title={serviceInformationLabels.AssignTo}
                className="w-full md:w-14rem"
                onChange={(e) => setAssignedTo(e.target.value)}
                options={teamMembers}
                disabled={disabled}
              />
            </div>
          )}
      </div>
    </div>
  );
}
