import React, { createContext } from 'react';
import { ClientSchemaInsert } from '@types';

export const defaultClientInformation: ClientSchemaInsert = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  postal_code: '',
  previously_used: '',
};

export enum ClientInfoActionType { Clear = 'clear', Update = 'update' }
export type ClientInfoAction =
  { type: ClientInfoActionType.Clear }
  | { type: ClientInfoActionType.Update, partialStateUpdate: Partial<ClientSchemaInsert> };

export const clientInfoReducer = (state: ClientSchemaInsert, action: ClientInfoAction) => {
  if (action.type === ClientInfoActionType.Update) {
    return { ...state, ...action.partialStateUpdate };
  }
  return { ...defaultClientInformation };
};

export const ClientInformationContext = createContext<ClientSchemaInsert>(null);
export const ClientInformationDispatchContext = createContext<React.Dispatch<
  ClientInfoAction>>(null);
interface ClientInformationProviderProps extends React.PropsWithChildren {
  state: ClientSchemaInsert,
  dispatch: React.Dispatch<ClientInfoAction>
}
export function ClientInformationProvider({
  children, state, dispatch,
}: ClientInformationProviderProps) {
  return (
    <ClientInformationContext.Provider value={state}>
      <ClientInformationDispatchContext.Provider value={dispatch}>
        {children}
      </ClientInformationDispatchContext.Provider>
    </ClientInformationContext.Provider>
  );
}
