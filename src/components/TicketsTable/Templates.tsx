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
import { ChangeEventHandler, useRef } from 'react';

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

export function UrgentBodyTemplate({ urgent }: ServiceRequestSummary) {
  return (
    <i
      aria-label={`${urgent ? 'urgent' : ''}`}
      className={`${urgent ? 'pi pi-exclamation-triangle' : ''}`}
    />
  );
}

export function OwnerAndPetTemplate({
  id, client, pet, urgent,
}: ServiceRequestSummary) {
  return (
    <div key={id}>
      <div className={`${urgent ? 'text-red-500' : 'text-gray-900'}`}>
        {client.first_name}
        {' '}
        {client.last_name}
      </div>
      <div className={`font-normal ${urgent ? 'text-red-500' : 'text-gray-900'}`}>{pet.name}</div>
    </div>
  );
}
/* ---------------------- FILTER TEMPLATES ---------------------- */

export function UrgentFilterTemplate(
  { value, filterApplyCallback }: ColumnFilterElementTemplateOptions,
) {
  return (
    <TriStateCheckbox
      value={value}
      onChange={(e) => filterApplyCallback(e.value)}
    />
  );
}

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

export function OwnerAndPetFilterTemplate({ options, handler }:
{ options: ColumnFilterElementTemplateOptions, handler: ChangeEventHandler }) {
  const nHandler = (e) => {
    handler(e);
    options.filterApplyCallback(e.target.value);
  };
  return (
    <InputText
      name="name search"
      value={options.value}
      onChange={nHandler}
      placeholder="Name"
    />
  );
}

export function HeaderTemplate({
  resetHandler, filtersActive, filters, setFilters,
}) {
  const op = useRef<OverlayPanel>(null);
  return (
    <div className="flex justify-content-between align-items-center">
      <Button className="flex gap-2" onClick={resetHandler} outlined={!filtersActive}>
        <i className={`pi pi-filter${filtersActive ? '-slash' : ''}`} />
        {' '}
        Clear
      </Button>
      <Button
        onClick={(e) => op.current?.toggle(e)}
        outlined={!filtersActive}
        icon="pi pi-filter"
        aria-label="global filter menu"
      />
      <OverlayPanel ref={op} showCloseIcon>
        <div className="flex justify-content-end align-items-center gap-2">
          <div className="flex gap-2">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="urgent_filter_control">Urgent</label>
            <TriStateCheckbox
              id="urgent_filter_control"
              aria-label="Urgent"
              value={filters.global_urgent.value}
              onChange={(e) => {
                const nFilters = { ...filters };
                nFilters.global_urgent.value = e.value;
                setFilters(nFilters);
              }}
            />
          </div>
          {filters.global_species.filterOptions.map(
            (option) => (
              <div key={option} className="flex gap-2">
                <label
                  htmlFor={`${option}_filter_control`}
                  className="capitalize"
                >
                  {option}
                </label>
                <Checkbox
                  id={`${option}_filter_control`}
                  checked={filters.global_species.value.includes(option)}
                  value={option}
                  onChange={(e) => {
                    const nFilters = { ...filters };
                    let { value } = nFilters.global_species;
                    if (e.target.checked) value = [...value, e.target.value];
                    else value = value.filter((item) => item !== e.target.value);
                    nFilters.global_species.value = value;
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
