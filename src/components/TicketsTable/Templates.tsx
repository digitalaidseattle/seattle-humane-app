import useAppConstants from '@hooks/useAppConstants';
import { AppConstantType, ServiceRequestSummary, TeamMemberType } from '@types';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { OverlayPanel } from 'primereact/overlaypanel';
import { SelectButton } from 'primereact/selectbutton';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { ChangeEvent, ChangeEventHandler, useRef } from 'react';
import { AppConstants } from 'src/constants';

/* ---------------------- BODY TEMPLATES ---------------------- */
// TODO: consolidate these into one dynamic template
export function CreatedAtBodyTemplate({ created_at, id }) {
  return (
    <span key={id}>
      {new Date(created_at).toLocaleDateString('en-US', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      })}
    </span>
  );
}

export function TeamMemberBodyTemplate({ id, team_member }: ServiceRequestSummary) {
  return (
    <div key={id}>
      <div>{team_member.first_name}</div>
      <div>{team_member.last_name}</div>
    </div>
  );
}

export function OwnerAndPetTemplate({
  id, client, pet, urgent,
}: ServiceRequestSummary) {
  return (
    <div key={id} className={`${urgent ? 'text-red-500' : 'text-gray-900'} flex justify-content-start align-items-center gap-2`}>
      <i
        aria-label={`${urgent ? 'urgent' : ''}`}
        className={`${urgent ? 'pi pi-exclamation-triangle' : ''}`}
      />
      <div>
        <div aria-label="client-name">
          {client.first_name}
          {' '}
          {client.last_name}
        </div>
        <div className={`font-normal ${urgent ? 'text-red-500' : 'text-gray-900'}`} aria-label="pet-name">{pet.name}</div>
      </div>
    </div>
  );
}
/* ---------------------- FILTER TEMPLATES ---------------------- */

export function CreatedAtFilterTemplate(
  { value, filterCallback, filterApplyCallback }: ColumnFilterElementTemplateOptions,
) {
  const { filterDate, sign } = value ?? { filterDate: '', sign: '=' };
  return (
    <div>
      <h5>Date Filter</h5>
      <Calendar
        value={filterDate}
        onChange={(e) => filterCallback({ filterDate: e.value, sign })}
        dateFormat="mm/dd/yy"
        placeholder="mm/dd/yyyy"
        mask="99/99/9999"
        showIcon
        style={{ minWidth: '100%' }}
      />
      <p />
      <SelectButton
        value={sign}
        options={[
          { label: 'Dates Before', value: '<' },
          { label: 'Exact Date', value: '=' },
          { label: 'Dates After', value: '>' }]}
        onChange={(e) => filterApplyCallback({ filterDate, sign: e.value })}
        unselectable={false}
        style={{ maxHeight: '3.5rem' }}
      />
    </div>
  );
}

function ItemTemplate(field: string) { return <span className="capitalize">{field}</span>; }

export function TeamMemberFilterTemplate(
  { options, optionList }:
    { options: ColumnFilterElementTemplateOptions, optionList: TeamMemberType[] },
) {
  const itemTemplate = (item: TeamMemberType) => ItemTemplate([item.first_name, item.last_name].join(' '));
  return (
    <MultiSelect
      value={options.value}
      options={optionList}
      optionValue="email"
      optionLabel="first_name"
      itemTemplate={itemTemplate}
      onChange={(e: MultiSelectChangeEvent) => options.filterApplyCallback(e.value)}
      placeholder="Team Member"
      maxSelectedLabels={1}
    />
  );
}

export function CategoryFilterTemplate(
  { options, optionList }:
    { options: ColumnFilterElementTemplateOptions, optionList: AppConstantType[] },
) {
  const itemTemplate = (item: AppConstantType) => ItemTemplate(item.label);
  return (
    <MultiSelect
      value={options.value}
      options={optionList}
      optionValue="label"
      optionLabel="label"
      itemTemplate={itemTemplate}
      onChange={(e: MultiSelectChangeEvent) => options.filterApplyCallback(e.value)}
      placeholder="Category"
      className="p-column-filter"
      maxSelectedLabels={1}
    />
  );
}

export function OwnerAndPetFilterTemplate({ options, externalFilterHandler }:
  { options: ColumnFilterElementTemplateOptions, externalFilterHandler: (e: ChangeEvent, options: ColumnFilterElementTemplateOptions['filterApplyCallback']) => void }) {

  return (
    <InputText
      name="name search"
      value={options.value}
      onChange={e => externalFilterHandler(e, options.filterApplyCallback)}
      placeholder="Name"
    />
  );
}

export function HeaderTemplate({
  resetHandler, areFiltersActive, filters, setFilters,
}) {
  const op = useRef<OverlayPanel>(null);
  const {
    data: speciesOptions,
    isLoading: speciesListLoading,
  } = useAppConstants(AppConstants.Species);
  return (
    <div className="flex justify-content-between align-items-center">
      <Button className="flex gap-2" onClick={resetHandler} outlined={!areFiltersActive}>
        <i className={`pi pi-filter${areFiltersActive ? '-slash' : ''}`} />
        {' '}
        Clear
      </Button>
      <Button
        onClick={(e) => op.current?.toggle(e)}
        outlined={!areFiltersActive}
        icon="pi pi-filter"
        aria-label="global filter menu"
      />
      <OverlayPanel aria-label="global filter menu overlay" ref={op} showCloseIcon>
        <div className="flex justify-content-end align-items-center gap-2">
          <div className="flex gap-2">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="urgent_filter_control">Urgent</label>
            <TriStateCheckbox
              id="urgent_filter_control"
              aria-label="Urgent"
              value={filters.global_urgent}
              onChange={(e) => {
                const nFilters = { ...filters };
                nFilters.global_urgent = e.value;
                setFilters(nFilters);
              }}
            />
          </div>
          {speciesOptions.map(
            (option) => (
              <div key={option.label} className="flex gap-2">
                <label
                  className="capitalize"
                >
                  {option.label}
                </label>
                <Checkbox
                  aria-label={option.label}
                  checked={filters.global_species.includes(option.label)}
                  value={option.label}
                  onChange={(e) => {
                    const nFilters = { ...filters };
                    let speciesFilter = nFilters.global_species;
                    if (e.target.checked) speciesFilter = [...speciesFilter, e.target.value];
                    else speciesFilter = speciesFilter.filter((item) => item !== e.target.value);
                    nFilters.global_species = speciesFilter;
                    setFilters(nFilters);
                  }}
                />
              </div>
            ),
          )}
        </div>
      </OverlayPanel>
    </div>
  );
}
