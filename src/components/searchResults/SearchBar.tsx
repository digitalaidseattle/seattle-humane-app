import InputSearch from '@components/InputSearch';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { Checkbox } from 'primereact/checkbox';
import React, { useEffect, useState } from 'react';

// TODO localize me
const messages = {
  cats: 'Cats',
  dogs: 'Dogs',
  clients: 'Clients',
};

// TODO get these from app constants
const filterTypes = ['clients', 'cats', 'dogs'];

/**
 * Reads the URL query params to perform
 * initialization and saving of the search query and search filters.
 * Submitting the search (e.g. via the search button) is enabled
 * only when the current unsaved search query is not empty.
 * The URL query params are updated when the search is submitted.
*/
const useSearch = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const [internalFilters, setFilters] = useState(new Set<string>());

  /**
   * Initializes the search query and filter selections
   * from the URL search parameters.
   */
  useEffect(() => {
    setSearchQuery(searchParams.get('search'));
    const queryParamInclude = searchParams.getAll('include');
    if (queryParamInclude.length) {
      setFilters(new Set(queryParamInclude));
    }
  }, [searchParams]);

  /**
   * Updates the URL search parameters with
   * the current search query and filter selections.
   */
  const submitSearch = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('search', searchQuery);
    newSearchParams.delete('include');
    internalFilters.forEach((type) => newSearchParams.append('include', type));
    router.push(`/?${newSearchParams.toString()}`);
  };

  /**
   * Hides the internal implementation
   * of the filters state variable from consumers,
   * exposing only a Set-like interface.
  */
  const filters = {
    add: (type: string) => {
      internalFilters.add(type);
      setFilters(new Set(internalFilters));
    },
    delete: (type: string) => {
      internalFilters.delete(type);
      setFilters(new Set(internalFilters));
    },
    has: (type: string) => internalFilters.has(type),
  };

  return {
    query: searchQuery,
    setQuery: (query: string) => setSearchQuery(query),
    submit: submitSearch,
    filters,
  };
};

function SearchBar() {
  // TODO consider moving this hook to a context so the search results page can consume the same state vars
  const {
    query, submit, setQuery, filters,
  } = useSearch();
  const [canSubmitSearch, setCanSubmitSearch] = useState(false);
  const [searchEnabled] = useState(true);

  /** Submits the current search query */
  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  /**
   * Disables or enables query sumbission
   * depending on whether a valid non-empyt query
   * is present, or whether searching is enabled
   */
  useEffect(() => {
    if (query && searchEnabled) setCanSubmitSearch(true);
    else setCanSubmitSearch(false);
  }, [query, searchEnabled]);

  const toggleFilter = (type: string, checked: boolean) => {
    if (checked) {
      filters.add(type);
    } else {
      filters.delete(type);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-row align-items-center">
      {filterTypes.map((type) => (
        <div
          className="flex flex-row align-items-center mx-2 text-lg"
          key={type}
        >
          <Checkbox
            className="mr-2"
            onChange={(e) => toggleFilter(type, e.checked)}
            checked={filters.has(type)}
            inputId={`checkbox_${type}`}
          />
          <label htmlFor={`checkbox_${type}`} className="p-checkbox-label">{messages[type]}</label>
        </div>
      ))}
      <InputSearch
        searchQuery={query}
        onSubmit={submit}
        onChange={setQuery}
        canSearch={canSubmitSearch}
        enabled={searchEnabled}
      />
    </form>
  );
}

export default SearchBar;
