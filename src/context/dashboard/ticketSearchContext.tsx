import React, { useCallback, useState } from 'react';

/**
 * Currently a ticket search term is a string.
 * This could be exapnded in the future for more complext search types.
 */
type TicketSearchState = string;

/** This context contains the search query. The search query is used by hooks that pass it to the DataService */
export const TicketSearchContext = React.createContext<TicketSearchState>('');
/** This context contains the function to be called when a user submits a search query. */
export const TicketSubmitSearchContext = React.createContext<(search: string) => void>(null);

/** Provides the two ticket search related contexts to children components */
export function TicketSearchProvider({
  children,
}: React.PropsWithChildren) {
  const [search, setSearch] = useState('');
  const submitSearch = useCallback((newSearch: string) => setSearch(newSearch), []);
  return (
    <TicketSearchContext.Provider value={search}>
      <TicketSubmitSearchContext.Provider value={submitSearch}>
        {children}
      </TicketSubmitSearchContext.Provider>
    </TicketSearchContext.Provider>
  );
}
