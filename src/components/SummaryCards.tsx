import useMyTickets from '@hooks/useMyTickets';
import useTicketsThisWeek from '@hooks/useTicketsThisWeek';

export default function SummaryCards() {
  const ticketsThisWeek = useTicketsThisWeek();
  const myTickets = useMyTickets();

  return (
    <div className="grid col-12">
      <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">My Newly Assigned Cases</span>
              <div className="text-900 font-medium text-xl">{myTickets.data.length}</div>
            </div>
            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
              <i className="pi pi-bell text-orange-500 text-xl" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 lg:col-6 xl:col-3">
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
  );
}
