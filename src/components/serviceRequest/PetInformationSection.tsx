import React, { useContext } from 'react';
import InputRadio from '@components/InputRadio';
import InputText from '@components/InputText';
import { PetInfoActionType, PetInformationContext, PetInformationDispatchContext } from '@context/serviceRequest/petInformationContext';
import { EditableAnimalType } from '@types';
import { useAppConstants } from '../../services/useAppConstants';

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
    show = ['name', 'breed', 'species', 'weight'],
  } = props;

  const { data: species } = useAppConstants('species');

  const visibleFields = new Set<keyof EditableAnimalType>(show);

  //* Retrieve form state from the context
  const formData = useContext(PetInformationContext);
  const dispatch = useContext(PetInformationDispatchContext);

  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<EditableAnimalType>) => dispatch(
    { type: PetInfoActionType.Update, partialStateUpdate },
  );
  const setName = (name: EditableAnimalType['name']) => setFormData({ name });
  const setSpecies = (species: EditableAnimalType['species']) => setFormData({ species });
  const setBreed = (breed: EditableAnimalType['breed']) => setFormData({ breed });
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
        {visibleFields.has('species')
          && (
            <div className="grid col-12">
              <div className="col-fixed mr-3">{petInformationLabels.Species}</div>
              <div className="flex flex-wrap gap-3">
                {species.map((s, i) => (
                  <InputRadio
                    key={i}
                    label={s.label}
                    value={s.value}
                    disabled={disabled}
                    name={`petSpecies-${s.value}`}
                    onChange={(e) => setSpecies(e.target.value)}
                    checked={formData.species === s.value}
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
