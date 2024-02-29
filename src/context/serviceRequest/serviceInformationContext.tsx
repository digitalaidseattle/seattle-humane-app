import { createContext } from "react";
import { EditableRequestType } from "@types";

export const defaultServiceInformation: EditableRequestType = {
  service_category: '',
  priority: '',
  source: '',
  description: '',
  status: '',
  assingedTo: ''
}

export enum ServiceInfoActionType { Clear = 'clear', Update = 'update'}
type ServiceInfoAction = { type: ServiceInfoActionType.Clear } | { type: ServiceInfoActionType.Update, partialStateUpdate: Partial<EditableRequestType>}

export const serviceInfoReducer = (state: EditableRequestType, action: ServiceInfoAction) => {
  if (action.type === ServiceInfoActionType.Update) return {...state, ...action.partialStateUpdate}
  if (action.type === ServiceInfoActionType.Clear) return { ...defaultServiceInformation }
}

export const ServiceInformationContext = createContext<EditableRequestType>(null)
export const ServiceInformationDispatchContext = createContext<React.Dispatch<ServiceInfoAction>>(null)
export function ServiceInformationProvider({children, state, dispatch}) {
  return <ServiceInformationContext.Provider value={state}>
    <ServiceInformationDispatchContext.Provider value={dispatch}>
      {children}
    </ServiceInformationDispatchContext.Provider>
  </ServiceInformationContext.Provider>
}