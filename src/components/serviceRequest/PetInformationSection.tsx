import React, { useContext } from 'react';
import InputRadio from '@components/InputRadio';
import InputText from '@components/InputText';
import { PetInfoActionType, PetInformationContext, PetInformationDispatchContext } from '@context/serviceRequest/petInformationContext';
import { AnimalSchemaInsert } from '@types';
import { useAppConstants } from 'src/services/useAppConstants';

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
    show = ['name', 'breed', 'species', 'weight'],
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
  const setSpecies = (species: AnimalSchemaInsert['species']) => setFormData({ species });
  const setBreed = (breed: AnimalSchemaInsert['breed']) => setFormData({ breed });
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
        {visibleFields.has('species')
          && (
            <div className="grid col-12">
              <div className="col-fixed mr-3">{petInformationLabels.Species}</div>
              <div className="flex flex-wrap gap-3">
                {speciesOptions.map((spec) => (
                  <InputRadio
                    id={`species-${spec.value}`}
                    key={spec.value}
                    label={spec.label}
                    value={spec.value}
                    disabled={disabled}
                    name={`species-${spec.value}`}
                    onChange={(e) => setSpecies(e.target.value)}
                    checked={formData.species === spec.value}
                  />
                ))}
              </div>
            </div>
          )}
        {visibleFields.has('breed')
          && (
            <div className="col-12 p-0">
              <div className="col-6">
                <InputText
                  id="breed"
                  value={formData.breed}
                  disabled={disabled}
                  label={petInformationLabels.Breeds}
                  placeholder={petInformationLabels.BreedsPlaceholder}
                  onChange={(e) => setBreed(e.target.value)}
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
                  value={`${formData.weight}`}
                  disabled={disabled}
                  label={petInformationLabels.Weight}
                  placeholder={petInformationLabels.WeightPlaceholder}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
