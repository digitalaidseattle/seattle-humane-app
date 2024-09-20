/* eslint-disable react/function-component-definition */
/**
 *  index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import TicketsTable from '@components/TicketsTable';
import useOpenTickets from '@hooks/useOpenTickets';

const AllOpenTickets: React.FC = () => {
  const { data: tickets, isLoading } = useOpenTickets();

  return (
    <>
      <h5>All Open Cases</h5>
      <TicketsTable
        items={tickets}
        loading={isLoading}
      />
    </>
  );
};

export default AllOpenTickets;
