/* eslint-disable react/function-component-definition */
/**
 *  index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import useOpenTickets from '@hooks/useOpenTickets';
import TicketsTable from '@components/TicketsTable';
import SampleDashboardStats from '@components/SampleDashbordStats';
import useRecentlyClosedTickets from '@hooks/useRecentlyClosedTickets';
import useMyTickets from '@hooks/useMyTickets';

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
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>My Cases</h5>
          <TicketsTable
            items={myTickets}
            loading={loadingMyTickets}
          />
        </div>
        <div className="card">
          <h5>Recently closed cases</h5>
          <TicketsTable
            items={recentlyClosedTickets}
            loading={loadingRecentlyClosedTickets}
          />
        </div>
      </div>

      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>All open cases</h5>
          <TicketsTable
            items={openTickets}
            loading={loadingOpenTickets}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
