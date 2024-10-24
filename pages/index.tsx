/* eslint-disable react/function-component-definition */
/**
 *  index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import useOpenTickets from '@hooks/useOpenTickets';
import TicketsTable from '@components/TicketsTable/TicketsTable';
import useRecentlyClosedTickets from '@hooks/useRecentlyClosedTickets';
import useMyTickets from '@hooks/useMyTickets';
import SampleDashboardStats from '@components/SampleDashbordStats';
import SearchField from '@components/dashboard/SearchField';
import { TicketSearchProvider } from '@context/dashboard/ticketSearchContext';

const Dashboard: React.FC = () => {
  const { data: myTickets, isLoading: loadingMyTickets } = useMyTickets();
  const { data: openTickets, isLoading: loadingOpenTickets } = useOpenTickets();
  const {
    data: recentlyClosedTickets,
    isLoading: loadingRecentlyClosedTickets,
  } = useRecentlyClosedTickets();

  return (
    <div className="grid">
      <SampleDashboardStats />
      <TicketSearchProvider>
        <div className="card col-12">
          <SearchField />
        </div>
        <div className="col-10 xl:col-6">
          <div className="card">
            <h5>My Cases</h5>
            <TicketsTable
              items={loadingMyTickets ? [] : myTickets}
              loading={loadingMyTickets}
            />
          </div>
          <div className="card">
            <h5>Recently closed cases</h5>
            <TicketsTable
              items={loadingRecentlyClosedTickets ? [] : recentlyClosedTickets}
              loading={loadingRecentlyClosedTickets}
            />
          </div>
        </div>
        <div className="card col-10 xl:col-6">
          <div className="card">
            <h5>All open cases</h5>
            <TicketsTable
              items={loadingOpenTickets ? [] : openTickets}
              loading={loadingOpenTickets}
            />
          </div>
        </div>
      </TicketSearchProvider>
    </div>
  )
};

export default Dashboard;
