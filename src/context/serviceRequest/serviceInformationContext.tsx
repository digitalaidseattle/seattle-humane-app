import React, { createContext } from 'react';
import { ServiceRequestSchemaInsert } from '@types';

export const defaultServiceInformation: ServiceRequestSchemaInsert = {
  client_id: null,
  created_at: '',
  description: '',
  id: '',
  log_id: null,
  pet_id: null,
  request_source_id: null,
  service_category_id: null,
  team_member_id: null,
};

export enum ServiceInfoActionType { Clear = 'clear', Update = 'update' }
type ServiceInfoAction = { type: ServiceInfoActionType.Clear }
| { type: ServiceInfoActionType.Update, partialStateUpdate: Partial<ServiceRequestSchemaInsert> };

export const serviceInfoReducer = (
  state: ServiceRequestSchemaInsert,
  action: ServiceInfoAction,
) => {
  if (action.type === ServiceInfoActionType.Update) {
    return { ...state, ...action.partialStateUpdate };
  }
  return { ...defaultServiceInformation };
};

export const ServiceInformationContext = createContext<ServiceRequestSchemaInsert>(null);
export const ServiceInformationDispatchContext = createContext<React.Dispatch<
ServiceInfoAction>>(null);

interface ServiceInformationProviderProps extends React.PropsWithChildren {
  state: ServiceRequestSchemaInsert,
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
