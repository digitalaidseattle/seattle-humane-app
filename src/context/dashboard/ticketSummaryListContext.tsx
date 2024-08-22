/** Generic type params in React context files result in long
 * lines that are tough to split, so the max-len rule is disabled
 */

import { ServiceRequestSummary } from '@types';
import React, { createContext } from 'react';

export const TicketSummaryListContext = createContext<ServiceRequestSummary[]>(null);

interface TicketSummaryListProviderProps extends React.PropsWithChildren {
  state: ServiceRequestSummary[],
}

export function TicketSummaryListProvider({
  children, state,
}: TicketSummaryListProviderProps) {
  return (
    <TicketSummaryListContext.Provider value={state}>
      {children}
    </TicketSummaryListContext.Provider>
  );
}
