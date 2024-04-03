import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import SearchResultItem from '@components/searchResults/SearchResultItem';
import type { SearchResultItemProps } from '@components/searchResults/SearchResultItem';

// TODO localize
const messages = {
  resultsHeader: 'Cases',
};

// TODO remove mock data when hooking up to data service
const mockResults: SearchResultItemProps[] = [
  {
    id: Math.random(),
    petName: 'Pet Name',
    clientName: 'Client Name',
    priority: 'URGENT',
    summary: 'Veternary Medical Assistance: Spay/Neuter',
    date: '03/03/2024',
    assignedTo: 'KC',
  },
  {
    id: Math.random(),
    petName: 'Variation',
    clientName: 'Client Name',
    priority: 'URGENT',
    summary: 'Food Assistance',
    date: '03/19/2024',
    assignedTo: 'KC',
  },
  {
    id: Math.random(),
    petName: 'Pet Name',
    clientName: 'Client Name',
    priority: 'URGENT',
    summary: 'Veternary Medical Assistance: Spay/Neuter',
    date: '03/03/2024',
    assignedTo: 'KC',
  },
  {
    id: Math.random(),
    petName: 'Pet Name',
    clientName: 'Client Name',
    priority: '',
    summary: 'Veternary Medical Assistance: Spay/Neuter',
    date: '03/03/2024',
    assignedTo: 'KC',
  },
  {
    id: Math.random(),
    petName: 'Pet Name',
    clientName: 'Client Name',
    priority: '',
    summary: 'Veternary Medical Assistance: Spay/Neuter',
    date: '03/03/2024',
    assignedTo: 'KC',
  },
  {
    id: Math.random(),
    petName: 'Pet Name',
    clientName: 'Client Name',
    priority: '',
    summary: 'Veternary Medical Assistance: Spay/Neuter',
    date: '03/03/2024',
    assignedTo: 'KC',
  },
];

// Using grid layout for the search result rows
const ulStyle = {
  display: 'grid',
  rowGap: '20px',
};

/**
 *
 * @returns A component that displays search results
 */
export default function SearchResultsCard() {
  // TODO get search results from context
  const filterMenuRef = useRef(null);
  return (
    <div className="card">
      <div className="flex justify-content-between align-items-center mb-5">
        <h5>{messages.resultsHeader}</h5>
        <div>
          <Button type="button" icon="pi pi-filter" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => filterMenuRef.current.toggle(event)} />
          <Menu
            ref={filterMenuRef}
            popup
            model={[
              { label: 'Filter placeholder item', icon: 'pi pi-fw pi-plus' },
            ]}
          />
        </div>
      </div>
      <ul className="list-none p-0 m-0" style={ulStyle}>
        {mockResults.map((result) => (
          <li key={result.id}>
            <SearchResultItem key={result.id} result={result} />
          </li>
        ))}
      </ul>
    </div>
  );
}
