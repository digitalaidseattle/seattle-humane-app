import React, { createContext } from "react";
import { EdiableClientInfo } from "@types";

export const defaultClientInformation: EdiableClientInfo = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  postalCode: '',
  previously_used: '',
}

export enum ClientInfoActionType { Clear = 'clear', Update = 'update'}
export type ClientInfoAction = { type: ClientInfoActionType.Clear } | { type: ClientInfoActionType.Update, partialStateUpdate: Partial<EdiableClientInfo>}

export const clientInfoReducer = (state: EdiableClientInfo, action: ClientInfoAction) => {
  if (action.type === ClientInfoActionType.Update) return {...state, ...action.partialStateUpdate}
  if (action.type === ClientInfoActionType.Clear) return { ...defaultClientInformation }
}

export const ClientInformationContext = createContext<EdiableClientInfo>(null)
export const ClientInformationDispatchContext = createContext<React.Dispatch<ClientInfoAction>>(null)
interface ClientInformationProviderProps extends React.PropsWithChildren {
  state: EdiableClientInfo,
  dispatch: React.Dispatch<ClientInfoAction>
}
export function ClientInformationProvider({children, state, dispatch}: ClientInformationProviderProps) {
  return <ClientInformationContext.Provider value={state}>
    <ClientInformationDispatchContext.Provider value={dispatch}>
      {children}
    </ClientInformationDispatchContext.Provider>
  </ClientInformationContext.Provider>
}