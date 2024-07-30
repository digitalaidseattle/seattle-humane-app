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
import useTicketsThisWeek from '@hooks/useTicketsThisWeek';

const Dashboard: React.FC = () => {
  const { data: myTickets, isLoading: loadingMyTickets } = useMyTickets();
  const { data: openTickets, isLoading: loadingOpenTickets } = useOpenTickets();
  const {
    data: recentlyClosedTickets,
    isLoading: loadingRecentlyClosedTickets,
  } = useRecentlyClosedTickets();
  const ticketsThisWeek = useTicketsThisWeek();

  return (
    <div className="grid">
      <SampleDashboardStats />
      <div className="col-12 xl:col-6">
        <div className="grid">
          <div className="col-12 lg:col-12 xl:col-6 mb-2">
            <div className="card mb-0">
              <div className="flex justify-content-between mb-3">
                <div>
                  <span className="block text-500 font-medium mb-3">New Cases This Week</span>
                  <div className="text-900 font-medium text-xl">{ticketsThisWeek.length}</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-teal-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                  <i className="pi pi-calendar text-teal-500 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
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
