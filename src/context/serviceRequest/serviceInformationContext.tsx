/** Generic type params in React context files result in long
 * lines that are tough to split, so the max-len rule is disabled
 */
/* eslint-disable max-len */

import React, { createContext } from 'react';
import { EditableServiceRequestType } from '@types';

export const defaultServiceInformation: EditableServiceRequestType = {
  client_id: '',
  pet_id: '',
  service_category: '',
  request_source: '',
  status: '',
  description: '',
  team_member_id: '',
};

export enum ServiceInfoActionType { Clear = 'clear', Update = 'update' }
type ServiceInfoAction = { type: ServiceInfoActionType.Clear } | { type: ServiceInfoActionType.Update, partialStateUpdate: Partial<EditableServiceRequestType> };

export const serviceInfoReducer = (
  state: EditableServiceRequestType,
  action: ServiceInfoAction,
) => {
  if (action.type === ServiceInfoActionType.Update) {
    return { ...state, ...action.partialStateUpdate };
  }
  return { ...defaultServiceInformation };
};

export const ServiceInformationContext = createContext<EditableServiceRequestType>(null);
export const ServiceInformationDispatchContext = createContext<React.Dispatch<ServiceInfoAction>>(null);
interface ServiceInformationProviderProps extends React.PropsWithChildren {
  state: EditableServiceRequestType,
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
