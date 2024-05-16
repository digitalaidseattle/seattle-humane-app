import React, { useContext } from 'react';
import InputRadio from '@components/InputRadio';
import InputText from '@components/InputText';
import { PetInfoActionType, PetInformationContext, PetInformationDispatchContext } from '@context/serviceRequest/petInformationContext';
import { EditableAnimalType } from '@types';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants } from 'src/constants';

// TODO externalize to localization file
export const petInformationLabels = {
  PetInformation: 'Pet Information',
  Name: 'Pet Name',
  NamePlaceholder: 'Name',
  Species: 'Pet Species',
  SpeciesPlaceholder: 'Species',
  Age: 'Pet Age',
  AgePlaceholder: 'Age in years',
  Weight: 'Pet Weight',
  WeightPlaceholder: 'lbs',
};

/** Props for the PetInformationSection */
interface PetInformationSectionProps {
  /** Flag to disable/enable the controls */
  disabled: boolean
  /** Fields to show on the form */
  show?: (keyof EditableAnimalType)[]
}

/**
 *
 * @param props {@link PetInformationSectionProps}
 * @returns A controlled form for creating a service request.
 */
export default function PetInformationSection(props: PetInformationSectionProps) {
  const {
    disabled,
    show = ['name', 'species_id', 'age', 'weight'],
  } = props;

  const visibleFields = new Set<keyof EditableAnimalType>(show);

  //* Retrieve form state from the context
  const formData = useContext(PetInformationContext);
  const dispatch = useContext(PetInformationDispatchContext);
  //* Options for multi-choice controls
  const speciesOptions = useAppConstants(AppConstants.Species);

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<EditableAnimalType>) => dispatch(
    { type: PetInfoActionType.Update, partialStateUpdate },
  );
  const setName = (name: EditableAnimalType['name']) => setFormData({ name });
  const setSpecies = (species_id: EditableAnimalType['species_id']) => setFormData({ species_id });
  const setAge = (age: EditableAnimalType['age']) => setFormData({ age });
  const setWeight = (weight: EditableAnimalType['weight']) => setFormData({ weight });

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
            <div className="grid col-12">
              <div className="col-fixed mr-3">{petInformationLabels.Species}</div>
              <div className="flex flex-wrap gap-3">
                {speciesOptions ? speciesOptions.map((spec) => (
                  <InputRadio
                    id={`species-${spec.value}`}
                    key={spec.value}
                    label={spec.label}
                    value={spec.value}
                    disabled={disabled}
                    name={`species-${spec.value}`}
                    onChange={(e) => setSpecies(e.target.value)}
                    checked={formData.species_id === spec.value}
                  />
                ))
                  : null}
              </div>
            </div>
          )}
        {visibleFields.has('age')
          && (
            <div className="col-12 p-0">
              <div className="col-6">
                <InputText
                  type="number"
                  id="age"
                  value={`${formData.age}`}
                  disabled={disabled}
                  label={petInformationLabels.Age}
                  placeholder={petInformationLabels.AgePlaceholder}
                  onChange={(e) => setAge(+e.target.value)}
                />
              </div>
            </div>
          )}
        {visibleFields.has('weight')
          && (
            <div className="col-12 p-0">
              <div className="col-6">
                <InputText
                  id="weight"
                  type="number"
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
