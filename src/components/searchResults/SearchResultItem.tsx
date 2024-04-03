import React from 'react';
import SearchResultItemMoreMenu from '@components/searchResults/SearchResultItemMenu';

// Using grid row layout for the search result fields
const searchResultItemGridLayout = {
  display: 'grid',
  gridTemplateColumns: '[names] 1fr [priority] 80px [summary] 4fr [date] 100px [assignedTo] 20px [more] 20px',
};

/**
 * The props type for the SearchResultsItem component
 */
export type SearchResultItemProps = {
  id: number
  petName: string
  clientName: string
  priority: string
  summary: string
  date: string
  assignedTo: string
};

/**
 *
 * @param props {@link SearchResultItemProps}
 * @returns The component
 */
export default function SearchResultItem({ result }: { result: SearchResultItemProps }) {
  const {
    petName, clientName, priority, summary, date, assignedTo,
  } = result;
  const highlightText = priority === 'URGENT' ? 'text-red-500' : '';

  return (
    <div
      style={searchResultItemGridLayout}
      className={`border-round p-2 align-items-center ${highlightText} hover:surface-100 cursor-pointer`}
    >
      <div>
        <div className="font-bold">{petName}</div>
        <div className="font-light">{clientName}</div>
      </div>
      <span className="font-bold">{priority}</span>
      <span className="font-bold">{summary}</span>
      <span className="font-bold">{date}</span>
      <span className="font-bold">{assignedTo}</span>
      <SearchResultItemMoreMenu />
    </div>
  );
}
