/** Generic type params in React context files result in long
 * lines that are tough to split, so the max-len rule is disabled
 */
/* eslint-disable max-len */

import React, { createContext } from 'react';
import { EditableServiceRequestType } from '@types';

export type CustomServiceRequestType = EditableServiceRequestType & { selected_pets: number[] };

export const defaultServiceInformation: CustomServiceRequestType = {
  selected_pets: [0],
  client_id: '',
  pet_id: '',
  service_category: '',
  request_source: '',
  status: '',
  description: '',
  team_member_id: '',
  urgent: false,
  modified_at: '',
};

export enum ServiceInfoActionType {
  Clear = 'clear',
  Update = 'update',
  Add = 'add',
  Remove = 'remove',
}

type ServiceInfoAction =
  | { type: ServiceInfoActionType.Clear }
  | { type: ServiceInfoActionType.Update, index: number, partialStateUpdate: Partial<CustomServiceRequestType> }
  | { type: ServiceInfoActionType.Add, newService: CustomServiceRequestType }
  | { type: ServiceInfoActionType.Remove, index: number };

export const serviceInfoReducer = (
  state: CustomServiceRequestType[],
  action: ServiceInfoAction,
) => {
  if (action.type === ServiceInfoActionType.Update) {
    return state.map((serviceRequest, idx) => {
      if (idx === action.index) {
        // ensure at least 1 pet is selected
        if (action.partialStateUpdate.selected_pets?.length < 1) action.partialStateUpdate.selected_pets.push(0);
        return ({ ...serviceRequest, ...action.partialStateUpdate });
      }
      return serviceRequest;
    });
  }

  if (action.type === ServiceInfoActionType.Add) return [...state, action.newService];

  if (action.type === ServiceInfoActionType.Remove) return state.filter((_, idx) => idx !== action.index);

  return [{ ...defaultServiceInformation }];
};

export const ServiceInformationContext = createContext<CustomServiceRequestType[]>(null);
export const ServiceInformationDispatchContext = createContext<React.Dispatch<ServiceInfoAction>>(null);
interface ServiceInformationProviderProps extends React.PropsWithChildren {
  state: CustomServiceRequestType[],
  dispatch: React.Dispatch<ServiceInfoAction>
}
export function ServiceInformationProvider({
  children, state, dispatch,
}: ServiceInformationProviderProps) {
  return (
    <ServiceInformationContext.Provider value={state}>
      <ServiceInformationDispatchContext.Provider value={dispatch}>
        {children}
      </ServiceInformationDispatchContext.Provider>
    </ServiceInformationContext.Provider>
  );
}
