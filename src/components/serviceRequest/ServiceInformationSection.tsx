import InputRadio from '@components/InputRadio';
import InputTextArea from '@components/InputTextArea';
import { ServiceInfoActionType, ServiceInformationContext, ServiceInformationDispatchContext } from '@context/serviceRequest/serviceInformationContext';
import { EditableServiceRequestType } from '@types';
import { Dropdown } from 'primereact/dropdown';
import { useContext } from 'react';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants } from 'src/constants';
import useTeamMembers from 'src/hooks/useTeamMembers';

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
    show = ['service_category', 'request_source', 'description', 'team_member_id'],
  } = props;

  const visibleFields = new Set<keyof EditableServiceRequestType>(show);

  //* Retrieve form state from the context
  const formData = useContext(ServiceInformationContext);
  const dispatch = useContext(ServiceInformationDispatchContext);

  const sources = useAppConstants(AppConstants.Source);
  const categories = useAppConstants(AppConstants.Category);
  const teamMembers = useTeamMembers();

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<EditableServiceRequestType>) => dispatch(
    { type: ServiceInfoActionType.Update, partialStateUpdate },
  );
  const setCategory = (service_category: EditableServiceRequestType['service_category']) => setFormData({ service_category });
  const setSource = (request_source: EditableServiceRequestType['request_source']) => setFormData({ request_source });
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
        {visibleFields.has('service_category')
          && (
            <div className="col-6">
              <div className="col-fixed mr-3">{serviceInformationLabels.Category}</div>
              <Dropdown
                id="service_category"
                value={formData.service_category}
                title={serviceInformationLabels.Category}
                className="w-full md:w-14rem"
                onChange={(e) => setCategory(e.target.value)}
                options={categories.map((opt) => ({ label: opt.label, value: opt.id }))}
                disabled={disabled}
              />
            </div>
          )}
        {visibleFields.has('request_source')
          && (
            <div className="grid col-12">
              <div className="col-fixed mr-3">{serviceInformationLabels.Source}</div>
              <div className="flex flex-wrap gap-3">
                {sources ? sources.map((opt) => (
                  <InputRadio
                    id={`request_source-${opt.value}`}
                    key={opt.value}
                    label={opt.label}
                    value={opt.id}
                    disabled={disabled}
                    name={`request_source-${opt.value}`}
                    onChange={(e) => setSource(e.target.value)}
                    checked={opt.id && formData.request_source === opt.id}
                  />
                ))
                  : null}
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
