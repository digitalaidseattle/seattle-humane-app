import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

/** Props for the InputSearch component */
interface InputSearchProps {
  /** The current search query */
  searchQuery: string
  /** The handler for changes to the search query */
  onChange: (newQuery: string) => void
  /** The handler for when the search query is submitted */
  onSubmit: () => void
  /** Whether the search button can be pressed */
  canSearch: boolean
  /** Whether the seacrh is enabled */
  enabled: boolean
}

export default function InputSearch({
  searchQuery, onSubmit, onChange, canSearch, enabled,
}: InputSearchProps) {
  return (
    <div className="p-inputgroup">
      <Button type="submit" className="pi pi-search" disabled={!canSearch || !enabled} onClick={onSubmit} />
      <InputText type="search" disabled={!enabled} value={searchQuery} onChange={(e) => onChange(e.target.value)} placeholder="Search..." />
    </div>
  );
}
