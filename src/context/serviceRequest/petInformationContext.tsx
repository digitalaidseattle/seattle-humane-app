/** Generic type params in React context files result in long
 * lines that are tough to split, so the max-len rule is disabled
 */
/* eslint-disable max-len */
import React, { createContext } from 'react';
import { EditableAnimalType } from '@types';

export const defaultPetInformation: EditableAnimalType = {
  name: '',
  species: '',
  weight: 0,
  age: 0,
};

export enum PetInfoActionType {
  Clear = 'clear',
  Update = 'update',
  Remove = 'remove',
  Add = 'add'
}

type AnimalInfoAction =
  | { type: PetInfoActionType.Clear }
  | { type: PetInfoActionType.Add, newPet: EditableAnimalType }
  | { type: PetInfoActionType.Remove, index: number }
  | { type: PetInfoActionType.Update, index: number, partialStateUpdate: Partial<EditableAnimalType> };

export const petInfoReducer = (state: EditableAnimalType[], action: AnimalInfoAction) => {
  if (action.type === PetInfoActionType.Update)
    return state.map((pet, idx) =>
      idx === action.index ? { ...pet, ...action.partialStateUpdate } : pet
    );

  if (action.type === PetInfoActionType.Add)
    return [...state, action.newPet];

  if (action.type === PetInfoActionType.Remove)
    return state.filter((_, idx) => idx !== action.index);

  return [{ ...defaultPetInformation }];
};

export const PetInformationContext = createContext<EditableAnimalType[]>(null);
export const PetInformationDispatchContext = createContext<React.Dispatch<AnimalInfoAction>>(null);

export function PetInformationProvider({ children, state, dispatch }) {
  return (
    <PetInformationContext.Provider value={state}>
      <PetInformationDispatchContext.Provider value={dispatch}>
        {children}
      </PetInformationDispatchContext.Provider>
    </PetInformationContext.Provider>
  );
}
