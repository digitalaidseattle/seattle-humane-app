import React from 'react';
import { Card } from 'primereact/card';
import useTicketsThisWeek from '@hooks/useTicketsThisWeek';
import useAssignedCases from '@hooks/useAssignedCases';

export interface DashboardStatCardsProps {
  className?: string;
}

export default function DashboardStatCards({ className = '' }: DashboardStatCardsProps) {
  const ticketsThisWeek = useTicketsThisWeek();
  const assignedCases = useAssignedCases();

  // eslint-disable-next-line max-len
  const renderCard = (title: string, value: number, iconClass: string, bgClass: string, testId: string) => (
    <Card className="mb-0">
      <div className="flex justify-content-between mb-3">
        <div>
          <span className="block text-500 font-medium mb-3">{title}</span>
          <div className="text-900 font-medium text-xl">{value}</div>
        </div>
        <div className={`flex align-items-center justify-content-center ${bgClass} border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
          <i className={`${iconClass} text-xl`} data-testid={testId} />
        </div>
      </div>
    </Card>
  );

  return (
    <div className={`grid col-12 ${className}`}>
      <div className="col-12 lg:col-6 xl:col-3">
        {renderCard(
          'New Assigned Cases',
          assignedCases.length,
          'pi pi-inbox text-cyan-500',
          'bg-cyan-100',
          'new-assigned-cases-icon',
        )}
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        {renderCard(
          'New Cases This Week',
          ticketsThisWeek.length,
          'pi pi-calendar text-teal-500',
          'bg-teal-100',
          'new-cases-this-week-icon',
        )}
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        {/* Empty div to maintain grid structure */}
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
        {/* Empty div to maintain grid structure */}
      </div>
    </div>
  );
}
