import InputText from '@components/InputText';
import TicketsTable from '@components/TicketsTable';
import { searchServiceRequests } from '@services/DataService';
import { ServiceRequestSummary } from '@types';
import { useState } from 'react';

export default function QuickSearch() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<ServiceRequestSummary[]>([]);
  const [busy, setBusy] = useState(false);
  const doSearch = async (e) => {
    setBusy(true);
    e.preventDefault();
    const res = await searchServiceRequests(search);
    setResults(res);
    setBusy(false);
  };
  return (
    <div className="card">
      <h5>Search Cases</h5>
      <form onSubmit={doSearch} className="pb-5">
        <InputText
          id="search"
          value={search}
          label="Search"
          placeholder="search for cases..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
      <TicketsTable
        items={results}
        loading={busy}
      />
    </div>
  );
}
