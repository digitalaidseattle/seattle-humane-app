/* eslint-disable react/function-component-definition */
/**
 *  index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React from 'react';
import SampleDashboardStats from '@components/SampleDashbordStats';
import SearchField from '@components/dashboard/SearchField';
import MyTickets from '@components/dashboard/MyTickets';
import AllOpenTickets from '@components/dashboard/AllOpenTickets';
import RecentlyClosedTickets from '@components/dashboard/RecentlyClosedTickets';
import { TicketSearchProvider } from '@context/dashboard/ticketSearchContext';

const Dashboard: React.FC = () => (
  <div className="grid">
    <SampleDashboardStats />
    <TicketSearchProvider>
      <div className="card col-12">
        <SearchField />
      </div>
      <div className="col-10 xl:col-6">
        <div className="card">
          <MyTickets />
        </div>
        <div className="card">
          <RecentlyClosedTickets />
        </div>
      </div>
      <div className="card col-10 xl:col-6">
        <AllOpenTickets />
      </div>
    </TicketSearchProvider>
  </div>
);

export default Dashboard;
