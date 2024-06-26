/** Generic type params in React context files result in long
 * lines that are tough to split, so the max-len rule is disabled
 */
/* eslint-disable max-len */
import React, { createContext } from 'react';
import { EditableClientType as EditableClientInfo } from '@types';

export const defaultClientInformation: EditableClientInfo = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  zip_code: '',
};

export enum ClientInfoActionType { Clear = 'clear', Update = 'update' }
export type ClientInfoAction =
  { type: ClientInfoActionType.Clear }
  | { type: ClientInfoActionType.Update, partialStateUpdate: Partial<EditableClientInfo> };

export const clientInfoReducer = (state: EditableClientInfo, action: ClientInfoAction) => {
  if (action.type === ClientInfoActionType.Update) {
    return { ...state, ...action.partialStateUpdate };
  }
  return { ...defaultClientInformation };
};

export const ClientInformationContext = createContext<EditableClientInfo>(null);
export const ClientInformationDispatchContext = createContext<React.Dispatch<ClientInfoAction>>(null);
interface ClientInformationProviderProps extends React.PropsWithChildren {
  state: EditableClientInfo,
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
