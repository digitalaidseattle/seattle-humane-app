import { EditableRequestType } from '@types';
import { Dispatch, PropsWithChildren, createContext } from 'react';

export const defaultServiceInformation: EditableRequestType = {
  service_category: '',
  service_category_id: '',
  priority: '',
  source: '',
  request_source_id: '',
  description: '',
  status: '',
  assigned_to: '',
  team_member_id: '',
  team_members: null,
};

export enum ServiceInfoActionType { Clear = 'clear', Update = 'update' }
/* eslint-disable @typescript-eslint/indent */
type ServiceInfoAction = { type: ServiceInfoActionType.Clear }
  | { type: ServiceInfoActionType.Update, partialStateUpdate: Partial<EditableRequestType> };

export const serviceInfoReducer = (state: EditableRequestType, action: ServiceInfoAction) => {
  if (action.type === ServiceInfoActionType.Update) {
    return { ...state, ...action.partialStateUpdate };
  }
  return { ...defaultServiceInformation };
};

export const ServiceInformationContext = createContext<EditableRequestType>(null);
export const ServiceInformationDispatchContext = createContext<Dispatch<ServiceInfoAction>>(null);
interface ServiceInformationProviderProps extends PropsWithChildren {
  state: EditableRequestType,
  dispatch: Dispatch<ServiceInfoAction>
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
