import React, { useContext, useState } from 'react';
import InputRadio from '@components/InputRadio';
import InputText from '@components/InputText';
import {
  defaultPetInformation, PetInfoActionType, PetInformationContext, PetInformationDispatchContext,
} from '@context/serviceRequest/petInformationContext';
import { PetType, EditablePetType } from '@types';
import useAppConstants from '@hooks/useAppConstants';
import { AppConstants } from 'src/constants';
import { Button } from 'primereact/button';

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
  RemoveButton: 'Remove',
  AddButton: 'Add Pet',
};

/** Props for the PetInformationSection */
interface PetInformationSectionProps {
  /** Flag to disable/enable the controls */
  disabled: boolean
  /** Flag to show/hide the option to create multiple pets */
  showAddPet?: boolean
  /** Fields to show on the form */
  show?: (keyof EditablePetType)[]
}

/**
 *
 * @param props {@link PetInformationSectionProps}
 * @returns A controlled form for creating a service request.
 */
export default function PetInformationSection(props: PetInformationSectionProps) {
  const {
    disabled,
    showAddPet = true,
    show = ['name', 'species', 'age', 'weight'],
  } = props;

  const visibleFields = new Set<keyof EditablePetType>(show);

  //* Retrieve form state from the context
  const pets = useContext(PetInformationContext);
  const dispatch = useContext(PetInformationDispatchContext);
  //* Options for multi-choice controls
  const { data: speciesOptions } = useAppConstants(AppConstants.Species);
  const [errors, setErrors] = useState<{ [key in keyof PetType]?: boolean }>({});
  const setError = (field: string, error: boolean) => {
    setErrors((p) => ({ ...p, [field]: error }));
  };

  //* Map onChange handlers to dispatch
  const updatePet = (partialStateUpdate: Partial<EditablePetType>, index: number) => dispatch(
    { type: PetInfoActionType.Update, index, partialStateUpdate },
  );
  const setName = (name: EditablePetType['name'], index: number) => updatePet({ name }, index);
  const setSpecies = (species: EditablePetType['species'], index: number) => updatePet({ species }, index);
  const setAge = (age: EditablePetType['age'], index: number) => updatePet({ age }, index);
  const setWeight = (weight: EditablePetType['weight'], index: number) => updatePet({ weight }, index);
  const validate = (fieldName: string, index: number) => {
    // empty field check
    if (fieldName === 'name') {
      const name = pets[index][fieldName];
      setError(fieldName, !name);
    }
  };

  const addNewPet = () => {
    dispatch({
      type: PetInfoActionType.Add,
      newPet: defaultPetInformation,
    });
  };

  const removePet = (index: number) => {
    dispatch({ type: PetInfoActionType.Remove, index });
  };

  return (

    <div className="grid">
      {pets.map((pet, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <div className="col-12">
            <h3 className="">
              {index > 0 && 'Additional'}
              {' '}
              {petInformationLabels.PetInformation}
            </h3>
          </div>
          <div className="col-12 grid row-gap-3 pl-5">
            {visibleFields.has('name')
              && (
                <div className="col-6">
                  <InputText
                    id="name"
                    value={pet.name}
                    disabled={disabled}
                    label={petInformationLabels.Name}
                    placeholder={petInformationLabels.Name}
                    onChange={(e) => setName(e.target.value, index)}
                    onBlur={() => validate('name', index)}
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
                        onChange={(e) => setSpecies(e.target.value, index)}
                        checked={spec.id && pet.species === spec.id}
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
                      value={`${pet.age}`}
                      disabled={disabled}
                      label={petInformationLabels.Age}
                      placeholder={petInformationLabels.AgePlaceholder}
                      onChange={(e) => setAge(+e.target.value, index)}
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
                      value={`${pet.weight}`}
                      disabled={disabled}
                      label={petInformationLabels.Weight}
                      placeholder={petInformationLabels.WeightPlaceholder}
                      onChange={(e) => setWeight(+e.target.value, index)}
                    />
                  </div>
                </div>
              )}
            {index > 0 && (
              <Button
                label="Remove"
                icon="pi pi-minus-circle"
                className="p-button-text"
                onClick={() => removePet(index)}
              />
            )}
          </div>
        </div>
      ))}
      {showAddPet && (
        <Button
          label={petInformationLabels.AddButton}
          icon="pi pi-plus-circle"
          className="p-button-text"
          outlined
          onClick={addNewPet}
        />
      )}
    </div>
  );
}
