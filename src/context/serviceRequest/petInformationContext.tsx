/** Generic type params in React context files result in long
 * lines that are tough to split, so the max-len rule is disabled
 */
/* eslint-disable max-len */
import React, { createContext } from 'react';
import { EditablePetType } from '@types';

export const defaultPetInformation: EditablePetType = {
  name: '',
  species: '',
  weight: 0,
  age: 0,
};

export enum PetInfoActionType {
  Clear = 'clear',
  Update = 'update',
  Remove = 'remove',
  Add = 'add',
}

type PetInfoAction =
  | { type: PetInfoActionType.Clear }
  | { type: PetInfoActionType.Add, newPet: EditablePetType }
  | { type: PetInfoActionType.Remove, index: number }
  | { type: PetInfoActionType.Update, index: number, partialStateUpdate: Partial<EditablePetType> };

export const petInfoReducer = (state: EditablePetType[], action: PetInfoAction) => {
  if (action.type === PetInfoActionType.Update) {
    return state.map((pet, idx) => (idx === action.index ? { ...pet, ...action.partialStateUpdate } : pet));
  }

  if (action.type === PetInfoActionType.Add) return [...state, action.newPet];

  if (action.type === PetInfoActionType.Remove) return state.filter((_, idx) => idx !== action.index);

  return [{ ...defaultPetInformation }];
};

export const PetInformationContext = createContext<EditablePetType[]>(null);
export const PetInformationDispatchContext = createContext<React.Dispatch<PetInfoAction>>(null);

interface PetInformationProviderProps extends React.PropsWithChildren {
  state: EditablePetType[],
  dispatch: React.Dispatch<PetInfoAction>
}

export function PetInformationProvider({ children, state, dispatch }: PetInformationProviderProps) {
  return (
    <PetInformationContext.Provider value={state}>
      <PetInformationDispatchContext.Provider value={dispatch}>
        {children}
      </PetInformationDispatchContext.Provider>
    </PetInformationContext.Provider>
  );
}
