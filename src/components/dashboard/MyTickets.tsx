/* eslint-disable react/function-component-definition */
/**
 *  index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import TicketsTable from '@components/TicketsTable';
import useMyTickets from '@hooks/useMyTickets';

const MyTickets: React.FC = () => {
  const { data: tickets, isLoading } = useMyTickets();

  return (
    <>
      <h5>My Cases</h5>
      <TicketsTable
        items={tickets}
        loading={isLoading}
      />
    </>
  );
};

export default MyTickets;
