import React, { useContext, useState } from 'react';
import InputRadio from '@components/InputRadio';
import InputText from '@components/InputText';
import { PetInfoActionType, PetInformationContext, PetInformationDispatchContext } from '@context/serviceRequest/petInformationContext';
import { AnimalType, EditableAnimalType } from '@types';
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
    show = ['name', 'species', 'age', 'weight'],
  } = props;

  const visibleFields = new Set<keyof EditableAnimalType>(show);

  //* Retrieve form state from the context
  const formData = useContext(PetInformationContext);
  const dispatch = useContext(PetInformationDispatchContext);
  //* Options for multi-choice controls
  const { data: speciesOptions } = useAppConstants(AppConstants.Species);
  const [errors, setErrors] = useState<{ [key in keyof AnimalType]?: boolean }>({});
  const setError = (field: string, error: boolean) => {
    setErrors((p) => ({ ...p, [field]: error }));
  };

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<EditableAnimalType>) => dispatch(
    { type: PetInfoActionType.Update, partialStateUpdate },
  );
  const setName = (name: EditableAnimalType['name']) => setFormData({ name });
  const setSpecies = (species: EditableAnimalType['species']) => setFormData({ species });
  const setAge = (age: EditableAnimalType['age']) => setFormData({ age });
  const setWeight = (weight: EditableAnimalType['weight']) => setFormData({ weight });
  const validate = (fieldName: string) => {
    // empty field check
    if (fieldName === 'name') {
      const name = formData[fieldName];
      setError(fieldName, !name);
    }
  };

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
                onBlur={() => validate('name')}
                invalid={errors.name}
              />
            </div>
          )}
        {visibleFields.has('species')
          && (
            <div className="grid col-12">
              <div className="col-fixed mr-3">{petInformationLabels.Species}</div>
              <div className="flex flex-wrap gap-3">
                {speciesOptions ? speciesOptions.map((spec) => (
                  <InputRadio
                    id={`species-${spec.value}`}
                    key={spec.value}
                    label={spec.label}
                    value={spec.id}
                    disabled={disabled}
                    name={`species-${spec.value}`}
                    onChange={(e) => setSpecies(e.target.value)}
                    checked={spec.id && formData.species === spec.id}
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
