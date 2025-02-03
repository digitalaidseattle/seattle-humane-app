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
  const updatePet = (partialStateUpdate: Partial<EditableAnimalType>, petIndex: number) => dispatch(
    { type: PetInfoActionType.Update, index: petIndex, partialStateUpdate },
  );
  const setName = (name: EditableAnimalType['name'], petIndex: number) => updatePet({ name }, petIndex);
  const setSpecies = (species: EditableAnimalType['species'], petIndex: number) => updatePet({ species }, petIndex);
  const setAge = (age: EditableAnimalType['age'], petIndex: number) => updatePet({ age }, petIndex);
  const setWeight = (weight: EditableAnimalType['weight'], petIndex: number) => updatePet({ weight }, petIndex);
  const validate = (fieldName: string, petIndex: number) => {
    // empty field check
    if (fieldName === 'name') {
      const name = formData[petIndex][fieldName];
      setError(fieldName, !name);
    }
  };

  const addNewPet = () => {
    dispatch({
      type: PetInfoActionType.Add,
      newPet: { name: '', species: '', weight: 0, age: 0 }
    });
  };

  const removePet = (index: number) => {
    dispatch({ type: PetInfoActionType.Remove, index });
  };

  return (

    <div className="grid">
      {formData.map((pet, petIndex) => {
        return <div key={petIndex}>
          <div className="col-12">
            <h3>
              {petIndex > 0 && "Additional"} {petInformationLabels.PetInformation}
              :
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
                    onChange={(e) => setName(e.target.value, petIndex)}
                    onBlur={() => validate('name', petIndex)}
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
                        onChange={(e) => setSpecies(e.target.value, petIndex)}
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
                      onChange={(e) => setAge(+e.target.value, petIndex)}
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
                      onChange={(e) => setWeight(+e.target.value, petIndex)}
                    />
                  </div>
                </div>
              )}
            {petIndex > 0 && <button onClick={() => removePet(petIndex)}>Remove</button>}
          </div>
        </div>
      })}
      <button onClick={addNewPet}>Add Pet</button>
    </div>
  );
}
