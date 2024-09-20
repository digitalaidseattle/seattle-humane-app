/* eslint-disable react/function-component-definition */
/**
 *  index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import TicketsTable from '@components/TicketsTable';
import useRecentlyClosedTickets from '@hooks/useRecentlyClosedTickets';

const RecentlyClosedTickets: React.FC = () => {
  const { data: tickets, isLoading } = useRecentlyClosedTickets();

  return (
    <>
      <h5>Recently Closed Cases</h5>
      <TicketsTable
        items={tickets}
        loading={isLoading}
      />
    </>
  );
};

export default RecentlyClosedTickets;
