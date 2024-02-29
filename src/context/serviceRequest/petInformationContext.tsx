import { createContext } from "react";
import { EditableAnimalType } from "@types";

export const defaultPetInformation: EditableAnimalType = {
  name: '',
  species: '',
  breed: '',
  weight: '',
}

export enum PetInfoActionType { Clear = 'clear', Update = 'update'}
type AnimalInfoAction = { type: PetInfoActionType.Clear } | { type: PetInfoActionType.Update, partialStateUpdate: Partial<EditableAnimalType>}

export const petInfoReducer = (state: EditableAnimalType, action: AnimalInfoAction) => {
  if (action.type === PetInfoActionType.Update) return {...state, ...action.partialStateUpdate}
  if (action.type === PetInfoActionType.Clear) return { ...defaultPetInformation }
}

export const PetInformationContext = createContext<EditableAnimalType>(null)
export const PetInformationDispatchContext = createContext<React.Dispatch<AnimalInfoAction>>(null)
export function PetInformationProvider({children, state, dispatch}) {
  return <PetInformationContext.Provider value={state}>
    <PetInformationDispatchContext.Provider value={dispatch}>
      {children}
    </PetInformationDispatchContext.Provider>
  </PetInformationContext.Provider>
}