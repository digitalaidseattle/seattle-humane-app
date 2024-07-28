/* eslint-disable import/no-duplicates */

/* eslint-disable react/function-component-definition */
/**
 *  index.tsx
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import React, { useState } from 'react';
import { useContext, useEffect } from 'react';
import { LayoutContext } from '@layout/context/layoutcontext';
import useTicketsThisWeek from '@hooks/useTicketsThisWeek';
import { TicketSummaryListProvider } from '@context/dashboard/ticketSummaryListContext';
import useAllTickets from '@hooks/useAllTickets';
import AllOpenTickets from '@components/dashboard/AllOpenTickets';
import RecentlyClosedTickets from '@components/dashboard/RecentlyClosedTickets';
import MyTickets from '@components/dashboard/MyTickets';

const Dashboard: React.FC = () => {
  const tickets = useAllTickets();
  const ticketsThisWeek = useTicketsThisWeek();
  const [lineOptions, setLineOptions] = useState(null);
  const { layoutConfig } = useContext(LayoutContext);

  const applyLightTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
        y: {
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef',
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  const applyDarkTheme = () => {
    const lineOptions = {
      plugins: {
        legend: {
          labels: {
            color: '#ebedef',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          },
        },
        y: {
          ticks: {
            color: '#ebedef',
          },
          grid: {
            color: 'rgba(160, 167, 181, .3)',
          },
        },
      },
    };

    setLineOptions(lineOptions);
  };

  useEffect(() => {
    if (layoutConfig.colorScheme === 'light') {
      applyLightTheme();
    } else {
      applyDarkTheme();
    }
  }, [layoutConfig.colorScheme]);

  return (
    <div className="grid">
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Orders</span>
              <div className="text-900 font-medium text-xl">152</div>
            </div>
            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-shopping-cart text-blue-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">24 new </span>
          <span className="text-500">since last visit</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Revenue</span>
              <div className="text-900 font-medium text-xl">$2.100</div>
            </div>
            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-map-marker text-orange-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">%52+ </span>
          <span className="text-500">since last week</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Customers</span>
              <div className="text-900 font-medium text-xl">28441</div>
            </div>
            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-inbox text-cyan-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">520 </span>
          <span className="text-500">newly registered</span>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Comments</span>
              <div className="text-900 font-medium text-xl">152 Unread</div>
            </div>
            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-comment text-purple-500 text-xl" />
            </div>
          </div>
          <span className="text-green-500 font-medium">85 </span>
          <span className="text-500">responded</span>
        </div>
      </div>
      <TicketSummaryListProvider state={tickets}>
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
            <MyTickets />
          </div>
          <div className="card">
            <h5>Recently closed cases</h5>
            <RecentlyClosedTickets />
          </div>
        </div>

        <div className="col-12 xl:col-6">
          <div className="card">
            <h5>All open cases</h5>
            <AllOpenTickets />
          </div>
        </div>
      </TicketSummaryListProvider>
    </div>
  );
};

export default Dashboard;
