import { InputText as PrimeReactInputText } from 'primereact/inputtext';
import { TicketSearchContext, TicketSubmitSearchContext } from '@context/dashboard/ticketSearchContext';
import { Button } from 'primereact/button';
import React, { useContext, useState } from 'react';

/**
 * Renders an input group with a search field, submit and clear buttons.
 * When the user submits the search, calls the handler in the {@link TicketSubmitSearchContext} with the search value.
 */
export default function SearchField() {
  /* searchInput updates as the user types characters into the field */
  const [searchInput, setSearchInput] = useState('');
  /*
  * lastSubmittedSearchInput only updates after the search has been submitted.
  * (i.e. search results have been fetched)
  */
  const lastSubmittedSearchInput = useContext(TicketSearchContext);
  /*
  * By submitting the search, any data fetching hooks that use the TicketSearchContext
  * will fetch data for the new search.
  */
  const submitSearch = useContext(TicketSubmitSearchContext);

  const clearSearch = () => {
    setSearchInput('');
    submitSearch('');
  };

  /*
  * Triggered by pressing the submit button or pressing Enter
  * while the cursor is in the input field.
  */
  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    submitSearch(searchInput);
  };

  return (
    <form onSubmit={onSubmit} className="pb-5">
      <h5>Search cases</h5>
      <div className="p-inputgroup flex-1">
        <Button
          type="submit"
          icon="pi pi-search"
          aria-label="submit search"
          className="p-button-success"
        />
        <PrimeReactInputText
          id="search"
          value={searchInput}
          placeholder="Search by name, email, category, team member..."
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button
          icon="pi pi-times"
          className="p-button-secondary"
          aria-label="clear search"
          disabled={!lastSubmittedSearchInput}
          onClick={clearSearch}
        />
      </div>
    </form>
  );
}
