import InputRadio from '@components/InputRadio';
import InputTextArea from '@components/InputTextArea';
import {
  CustomServiceRequestType,
  defaultServiceInformation,
  ServiceInfoActionType,
  ServiceInformationContext,
  ServiceInformationDispatchContext,
} from '@context/serviceRequest/serviceInformationContext';
import { PetInformationContext } from '@context/serviceRequest/petInformationContext';

import { EditableServiceRequestType } from '@types';
import { Dropdown } from 'primereact/dropdown';
import { useContext, useEffect } from 'react';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants } from 'src/constants';
import useTeamMembers from 'src/hooks/useTeamMembers';
import { Button } from 'primereact/button';

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
  RemoveButton: 'Remove',
  AddButton: 'Add Service',
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
  /** Flage to show/hide the option to add multiple tickets */
  showAddTicket?: boolean
  /** Fields to show on the form */
  show?: (keyof EditableServiceRequestType)[]
  /** Internal or external variant */
  variant?: 'internal' | 'external'
}

/**
 *
 * @param props {@link ServiceInformationSectionProps}
 * @returns A controlled form for creating a service request.
 */
export default function ServiceInformationSection(props: ServiceInformationSectionProps) {
  const {
    disabled,
    showAddTicket = true,
    show = ['service_category', 'request_source', 'status', 'description', 'team_member_id'],
    variant: formVariant = 'internal',
  } = props;

  const visibleFields = new Set<keyof EditableServiceRequestType>(show);

  //* Retrieve form state from the context
  const serviceRequests = useContext(ServiceInformationContext);
  const pets = useContext(PetInformationContext);
  const dispatch = useContext(ServiceInformationDispatchContext);

  const { data: sources, isLoading: isSourcesLoading } = useAppConstants(AppConstants.Source);
  const { data: statuses, isLoading: isStatusesLoading } = useAppConstants(AppConstants.Status);
  const { data: categories } = useAppConstants(AppConstants.Category);
  const teamMembers = useTeamMembers();

  //* Map onChange handlers to dispatch
  const updateServiceRequest = (
    partialStateUpdate: Partial<CustomServiceRequestType>,
    index: number,
  ) => {
    dispatch(
      { type: ServiceInfoActionType.Update, index, partialStateUpdate },
    );
  };
  const setCategory = (service_category: EditableServiceRequestType['service_category'], index: number) => updateServiceRequest({ service_category }, index);
  const setSource = (request_source: EditableServiceRequestType['request_source'], index: number) => updateServiceRequest({ request_source }, index);
  const setStatus = (status: EditableServiceRequestType['status'], index: number) => updateServiceRequest({ status }, index);
  const setServiceDescription = (description: EditableServiceRequestType['description'], index: number) => updateServiceRequest({ description }, index);
  const setAssignedTo = (team_member_id: EditableServiceRequestType['team_member_id'], index: number) => updateServiceRequest({ team_member_id }, index);
  const setSelectedPets = (
    selected_pets: number[],
    serviceRequestIndex: number,
  ) => updateServiceRequest({ selected_pets }, serviceRequestIndex);
  const defaultStatus = () => statuses.filter((status) => status.value === 'open')[0].id;
  const defaultSource = () => sources.filter((source) => source.value === 'web form')[0].id;
  const defaultTeamMember = () => teamMembers[0].value;

  const togglePetSelection = (petIdx: number, svcReqIndex: number) => {
    const svcReq = serviceRequests[svcReqIndex];
    if (svcReq.selected_pets.includes(petIdx)) {
      setSelectedPets(svcReq.selected_pets.filter((i) => i !== petIdx), svcReqIndex);
    } else {
      setSelectedPets([...svcReq.selected_pets, petIdx], svcReqIndex);
    }
  };

  useEffect(() => {
    if (isStatusesLoading || isSourcesLoading || teamMembers.length < 1) return;
    if (formVariant === 'external') {
      setStatus(defaultStatus(), 0);
      setSource(defaultSource(), 0);
      setAssignedTo(defaultTeamMember(), 0);
    }
  }, [formVariant, isStatusesLoading, isSourcesLoading, teamMembers]);

  const addNewServiceRequest = () => {
    dispatch({
      type: ServiceInfoActionType.Add,
      newService: defaultServiceInformation,
    });
  };

  const removeServiceRequest = (index: number) => {
    dispatch({ type: ServiceInfoActionType.Remove, index });
  };

  return (
    <div className="grid">
      {serviceRequests.map((serviceRequest, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <div className="col-12">
            <h3>
              {index > 0 && 'Additional'}
              {' '}
              {serviceInformationLabels.ServiceDetails}
            </h3>
          </div>
          {(showAddTicket && pets.length)
            && (
              <div className="col-12 grid row-gap-5 pl-5">
                <span>Select Pet(s):</span>
                {pets
                  .filter(({ name }) => !!name)
                  .map((pet, petIndex) => (
                    /* eslint-disable-next-line react/no-array-index-key */
                    <div key={petIndex}>
                      <input // FIXME use component from component library
                        id={pet.name}
                        type="checkbox"
                        checked={serviceRequest.selected_pets.includes(petIndex)}
                        value={pet.name}
                        onChange={() => togglePetSelection(petIndex, index)}
                      />
                      <label htmlFor={pet.name}>{pet.name}</label>
                    </div>
                  ))}
              </div>
            )}
          <div className="col-12 grid row-gap-3 pl-5">
            {visibleFields.has('service_category')
              && (
                <div className="col-6">
                  <div className="col-fixed mr-3">{serviceInformationLabels.Category}</div>
                  <Dropdown
                    id="service_category"
                    value={serviceRequest.service_category}
                    title={serviceInformationLabels.Category}
                    className="w-full md:w-14rem"
                    onChange={(e) => setCategory(e.target.value, index)}
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
                        onChange={(e) => setSource(e.target.value, index)}
                        checked={opt.id && serviceRequest.request_source === opt.id}
                      />
                    ))
                      : null}
                  </div>
                </div>
              )}
            {visibleFields.has('status')
              && (
                <div className="grid col-12">
                  <div className="col-fixed mr-3">{serviceInformationLabels.Status}</div>
                  <div className="flex flex-wrap gap-3">
                    {statuses ? statuses.map((opt) => (
                      <InputRadio
                        id={`staus-${opt.value}`}
                        key={opt.value}
                        label={opt.label}
                        value={opt.id}
                        disabled={disabled}
                        name={`staus-${opt.value}`}
                        onChange={(e) => setStatus(e.target.value, index)}
                        checked={opt.id && serviceRequest.status === opt.id}
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
                    value={serviceRequest.description}
                    disabled={disabled}
                    label={serviceInformationLabels.ServiceDescription}
                    placeholder={serviceInformationLabels.ServiceDescription}
                    onChange={(e) => setServiceDescription(e.target.value, index)}
                    rows={5}
                  />
                </div>
              )}
            {visibleFields.has('team_member_id')
              && (
                <div className="col-12">
                  <div className="col-fixed mr-3">{serviceInformationLabels.AssignTo}</div>

                  <Dropdown
                    id="team_member_id"
                    value={serviceRequest.team_member_id}
                    title={serviceInformationLabels.AssignTo}
                    className="w-full md:w-14rem"
                    onChange={(e) => setAssignedTo(e.target.value, index)}
                    options={teamMembers}
                    disabled={disabled}
                  />
                </div>
              )}
            {index > 0 && (
              <Button
                label="Remove"
                icon="pi pi-minus-circle"
                className="p-button-text"
                type="button"
                onClick={() => removeServiceRequest(index)}
              />
            )}
          </div>
        </div>
      ))}
      {showAddTicket && (
        <div className="col-12">
          <Button
            label="Add Service Request"
            icon="pi pi-plus-circle"
            className="p-button-text"
            onClick={addNewServiceRequest}
          />
        </div>
      )}
    </div>
  );
}
