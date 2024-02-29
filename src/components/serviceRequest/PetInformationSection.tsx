import React, { useContext } from "react";
import InputRadio from "../InputRadio";
import InputText from "../InputText";
import { PetInfoActionType, PetInformationContext, PetInformationDispatchContext } from "../../context/serviceRequest/petInformationContext";
import { EditableAnimalType } from "../../types";

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
  WeightPlaceholder: 'lbs'
}

/** Props for the PetInformationSection */
interface PetInformationSectionProps {
  /** Flag to disable/enable the controls */
  disabled: boolean
}


//* Options for multi-choice controls
const speciesOptions = ['Dog', 'Cat', 'Small mammal', 'Bird']

/**
 * 
 * @param props {@link PetInformationSectionProps}
 * @returns A controlled form for creating a service request.  
 */
export default function PetInformationSection(props: PetInformationSectionProps) {
  const { disabled } = props

  //* Retrieve form state from the context
  const formData = useContext(PetInformationContext)
  const dispatch = useContext(PetInformationDispatchContext)
  
  //* Map onChange handlers to dispatch
  const setFormData = (partialStateUpdate: Partial<EditableAnimalType>) => dispatch({type: PetInfoActionType.Update, partialStateUpdate})
  const setName = (name: EditableAnimalType['name']) => setFormData({name})
  const setSpecies = (species: EditableAnimalType['species']) => setFormData({species})
  const setBreed = (breed: EditableAnimalType['breed']) => setFormData({breed})
  const setWeight= (weight: EditableAnimalType['weight']) => setFormData({weight})

  return (
    <>
      <div className="grid">
        <div className="col-12"><h3>{petInformationLabels.PetInformation}:</h3></div>
        <div className="col-12 grid row-gap-3 pl-5">
          <div className="col-6 pr-8">
            <InputText
              id="petName"
              value={formData.name}
              disabled={disabled}
              label={petInformationLabels.Name}
              placeholder={petInformationLabels.Name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid col-12">
            <div className="col-fixed mr-3">{petInformationLabels.Species}</div>
            <div className="flex flex-wrap gap-3">
              {speciesOptions.map((val, i) => (
                <InputRadio
                  key={i}
                  label={val}
                  value={val}
                  disabled={disabled}
                  name={`petSpecies-${val}`}
                  onChange={(e) => setSpecies(e.target.value)}
                  checked={formData.species === val}
                />
              ))}
            </div>
          </div>
          <div className="col-12 p-0">
            <div className="col-6 pr-8">
              <InputText
                id="petBreeds"
                value={formData.breed}
                disabled={disabled}
                label={petInformationLabels.Breeds}
                placeholder={petInformationLabels.BreedsPlaceholder}
                onChange={(e) => setBreed(e.target.value)}
              />
            </div>
          </div>
          <div className="col-12 p-0">
            <div className="col-6 pr-8">
              <InputText
                id="petWeight"
                value={`${formData.weight}`}
                disabled={disabled}
                label={petInformationLabels.Weight}
                placeholder={petInformationLabels.WeightPlaceholder}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}