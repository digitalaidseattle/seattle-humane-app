/* eslint-disable react/jsx-indent */
/* eslint-disable implicit-arrow-linebreak */
import InputRadio from '@components/InputRadio';
import InputTextArea from '@components/InputTextArea';
import {
  ServiceInfoActionType,
  ServiceInformationContext,
  ServiceInformationDispatchContext,
} from '@context/serviceRequest/serviceInformationContext';
import { EditableServiceRequestType } from '@types';
import { Dropdown } from 'primereact/dropdown';
import { useContext, useState, useEffect } from 'react';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants } from 'src/constants';
import useTeamMembers from 'src/hooks/useTeamMembers';
import { handleInputEdit } from './ClientInformationSection';
import { setRequestMeta } from 'next/dist/server/request-meta';

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
  disabled: boolean;
  /** Fields to show on the form */
  show?: (keyof EditableServiceRequestType)[];
}

/**
 *
 * @param props {@link ServiceInformationSectionProps}
 * @returns A controlled form for creating a service request.
 */
export default function ServiceInformationSection(
  props: ServiceInformationSectionProps
) {
  const [updatedServiceCategory, setUpdatedServiceCategory] = useState(null);
  const [updatedRequestSource, setUpdatedRequestSource] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState(null);
  const [updatedMemberId, setUpdatedMemberId] = useState(null);

  interface EditedServiceDetails {
    service_category: string;
    request_source: string;
    status: string;
    description: string;
    member_id: string;
  }

  // holds edited/updated form values for service details,
  // will later be dispatched to the context and saved to database
  const updatedServiceDetails: EditedServiceDetails = {
    service_category: updatedServiceCategory,
    request_source: updatedRequestSource,
    status: updatedStatus,
    description: updatedDescription,
    member_id: updatedMemberId,
  };

  const {
    disabled,
    show = [
      'service_category',
      'request_source',
      'status',
      'description',
      'team_member_id',
    ],
  } = props;

  const visibleFields = new Set<keyof EditableServiceRequestType>(show);

  //* Retrieve form state from the context
  const formData = useContext(ServiceInformationContext);
  const dispatch = useContext(ServiceInformationDispatchContext);

  const { data: sources } = useAppConstants(AppConstants.Source);
  const { data: statuses } = useAppConstants(AppConstants.Status);
  const { data: categories } = useAppConstants(AppConstants.Category);
  const teamMembers = useTeamMembers();

  //* Map onChange handlers to dispatch
  const setFormData = (
    partialStateUpdate: Partial<EditableServiceRequestType>
  ) => dispatch({ type: ServiceInfoActionType.Update, partialStateUpdate });
  const setCategory = (
    service_category: EditableServiceRequestType['service_category']
  ) => setFormData({ service_category });
  const setSource = (
    request_source: EditableServiceRequestType['request_source']
  ) => setFormData({ request_source });
  const setStatus = (status: EditableServiceRequestType['status']) =>
    setFormData({ status });
  const setServiceDescription = (
    description: EditableServiceRequestType['description']
  ) => setFormData({ description });
  const setAssignedTo = (
    team_member_id: EditableServiceRequestType['team_member_id']
  ) => setFormData({ team_member_id });

  useEffect(() => {
    setUpdatedServiceCategory(formData.service_category);
    setUpdatedRequestSource(formData.request_source);
    setUpdatedStatus(formData.status);
    setUpdatedDescription(formData.description);
    setUpdatedMemberId(formData.team_member_id);
  }, [formData]);

  return (
    <div className='grid'>
      <div className='col-12'>
        <h3>{serviceInformationLabels.ServiceDetails}:</h3>
      </div>
      <div className='col-12 grid row-gap-3 pl-5'>
        {visibleFields.has('service_category') && (
          <div className='col-6'>
            <div className='col-fixed mr-3'>
              {serviceInformationLabels.Category}
            </div>
            <Dropdown
              id='service_category'
              value={updatedServiceCategory}
              title={serviceInformationLabels.Category}
              className='w-full md:w-14rem'
              onChange={(e) =>
                handleInputEdit(
                  'service_category',
                  setUpdatedServiceCategory,
                  setCategory,
                  e.target.value
                )
              }
              options={categories.map((opt) => ({
                label: opt.label,
                value: opt.id,
              }))}
              disabled={disabled}
            />
          </div>
        )}
        {visibleFields.has('request_source') && (
          <div className='grid col-12'>
            <div className='col-fixed mr-3'>
              {serviceInformationLabels.Source}
            </div>
            <div className='flex flex-wrap gap-3'>
              {sources
                ? sources.map((opt) => (
                    <InputRadio
                      id={`request_source-${opt.value}`}
                      key={opt.value}
                      label={opt.label}
                      value={opt.id}
                      disabled={disabled}
                      name={`request_source-${opt.value}`}
                      onChange={(e) =>
                        handleInputEdit(
                          'request_source',
                          setUpdatedRequestSource,
                          setSource,
                          e.target.value
                        )
                      }
                      // checked={opt.id && formData.request_source === opt.id}
                      checked={opt.id && updatedRequestSource === opt.id}
                    />
                  ))
                : null}
            </div>
          </div>
        )}
        {visibleFields.has('status') && (
          <div className='grid col-12'>
            <div className='col-fixed mr-3'>
              {serviceInformationLabels.Status}
            </div>
            <div className='flex flex-wrap gap-3'>
              {statuses
                ? statuses.map((opt) => (
                    <InputRadio
                      id={`staus-${opt.value}`}
                      key={opt.value}
                      label={opt.label}
                      value={opt.id}
                      disabled={disabled}
                      name={`staus-${opt.value}`}
                      onChange={(e) =>
                        handleInputEdit(
                          'status',
                          setUpdatedStatus,
                          setStatus,
                          e.target.value
                        )
                      }
                      // checked={opt.id && formData.status === opt.id}
                      checked={opt.id && updatedStatus === opt.id}
                    />
                  ))
                : null}
            </div>
          </div>
        )}
        {visibleFields.has('description') && (
          <div className='col-12'>
            <InputTextArea
              id='description'
              value={updatedDescription}
              disabled={disabled}
              label={serviceInformationLabels.ServiceDescription}
              placeholder={serviceInformationLabels.ServiceDescription}
              onChange={(e) =>
                handleInputEdit(
                  'description',
                  setUpdatedDescription,
                  setServiceDescription,
                  e.target.value
                )
              }
              rows={5}
            />
          </div>
        )}
        {visibleFields.has('team_member_id') && (
          <div className='col-6'>
            <div className='col-fixed mr-3'>
              {serviceInformationLabels.AssignTo}
            </div>

            <Dropdown
              id='team_member_id'
              value={updatedMemberId}
              title={serviceInformationLabels.AssignTo}
              className='w-full md:w-14rem'
              onChange={(e) =>
                handleInputEdit(
                  'team_member_id',
                  setUpdatedMemberId,
                  setAssignedTo,
                  e.target.value
                )
              }
              options={teamMembers}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </div>
  );
}
