import React, { useContext } from 'react';
import InputText from '@components/InputText';
import { PetInfoActionType, PetInformationContext, PetInformationDispatchContext } from '@context/serviceRequest/petInformationContext';
import { AnimalSchemaInsert } from '@types';
import { useAppConstants } from 'src/services/useAppConstants';
import { Dropdown } from 'primereact/dropdown';

// TODO externalize to localization file
export const petInformationLabels = {
  PetInformation: 'Pet Information',
  Name: 'Pet Name',
  NamePlaceholder: 'Name',
  Species: 'Pet Species',
  SpeciesPlaceholder: 'Species',
  Breeds: 'Pet Breed(s)',
  BreedsPlaceholder: 'Breeds',
  Weight: 'Pet Weight',
  WeightPlaceholder: 'lbs',
};

/** Props for the PetInformationSection */
interface PetInformationSectionProps {
  /** Flag to disable/enable the controls */
  disabled: boolean
  /** Fields to show on the form */
  show?: (keyof AnimalSchemaInsert)[]
}

/**
 *
 * @param props {@link PetInformationSectionProps}
 * @returns A controlled form for creating a service request.
 */
export default function PetInformationSection(props: PetInformationSectionProps) {
  const {
    disabled,
    show = ['name', 'species_id'],
  } = props;

  const visibleFields = new Set<keyof AnimalSchemaInsert>(show);

  //* Retrieve form state from the context
  const formData = useContext(PetInformationContext);
  const dispatch = useContext(PetInformationDispatchContext);
  //* Options for multi-choice controls
  const { data: speciesOptions } = useAppConstants('species');

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<AnimalSchemaInsert>) => dispatch(
    { type: PetInfoActionType.Update, partialStateUpdate },
  );
  const setName = (name: AnimalSchemaInsert['name']) => setFormData({ name });
  const setSpecies = (species_id: AnimalSchemaInsert['species_id']) => setFormData({ species_id });
  const setWeight = (weight: AnimalSchemaInsert['weight']) => setFormData({ weight });

  return (
    <div className="grid">
      <div className="col-12">
        <h3>
          {petInformationLabels.PetInformation}
          :
        </h3>
      </div>
      <div className="col-12 grid row-gap-3 pl-5">
        {visibleFields.has('name')
          && (
            <div className="col-6">
              <InputText
                id="name"
                value={formData.name}
                disabled={disabled}
                label={petInformationLabels.Name}
                placeholder={petInformationLabels.Name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
        {visibleFields.has('species_id')
          && (
            <div className="flex flex-column gap-2 col-6">
              <label htmlFor="category" className="mr-3">{petInformationLabels.Species}</label>
              <Dropdown
                id="species_id"
                value={formData.species_id}
                title={petInformationLabels.Species}
                className="w-full md:w-14rem"
                onChange={(e) => setSpecies(e.target.value)}
                options={speciesOptions}
                disabled={disabled}
              />
            </div>
          )}
        {visibleFields.has('weight')
          && (
            <div className="col-12 p-0">
              <div className="col-6">
                <InputText
                  id="weight"
                  value={`${formData.weight}`}
                  disabled={disabled}
                  label={petInformationLabels.Weight}
                  placeholder={petInformationLabels.WeightPlaceholder}
                  onChange={(e) => setWeight(+e.target.value)}
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
