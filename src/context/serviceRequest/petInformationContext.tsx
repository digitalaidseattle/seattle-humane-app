import React, { createContext } from 'react';
import { AnimalSchemaInsert } from '@types';

export const defaultPetInformation: AnimalSchemaInsert = {
  name: '',
  species: '',
  breed: '',
  weight: '',
};

export enum PetInfoActionType { Clear = 'clear', Update = 'update' }
type AnimalInfoAction = { type: PetInfoActionType.Clear }
  | { type: PetInfoActionType.Update, partialStateUpdate: Partial<AnimalSchemaInsert> };

export const petInfoReducer = (state: AnimalSchemaInsert, action: AnimalInfoAction) => {
  if (action.type === PetInfoActionType.Update) return { ...state, ...action.partialStateUpdate };
  return { ...defaultPetInformation };
};

export const PetInformationContext = createContext<AnimalSchemaInsert>(null);
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
