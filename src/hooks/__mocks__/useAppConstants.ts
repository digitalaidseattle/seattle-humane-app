import { AppConstants, TicketStatus } from 'src/constants';

export default function useAppConstants(type: string) {
  // moved data declaration to the bottom for readability
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return MockAppConstants[type];
}

const emptyRecord = {
  id: '',
  changed_at: '',
  changed_by: '',
  created_at: '',
};

export const MockAppConstants = {
  [AppConstants.Species]: [
    {
      ...emptyRecord,
      id: 'bird-id',
      value: 'bird',
      label: 'BIRD',
      type: AppConstants.Species,
      active: true,
    },
    {
      ...emptyRecord,
      id: 'dog-id',
      value: 'dog',
      label: 'DOG',
      type: AppConstants.Species,
      active: true,
    },
  ],
  [AppConstants.Source]: [
    {
      ...emptyRecord,
      id: 'phone-id',
      value: 'phone',
      label: 'PHONE',
      type: AppConstants.Source,
      active: true,
    },
    {
      ...emptyRecord,
      id: 'walkin-id',
      value: 'walkin',
      label: 'Walk-in',
      type: AppConstants.Source,
      active: true,
    },
  ],
  [AppConstants.Status]: [
    {
      ...emptyRecord,
      id: 'open-id',
      value: TicketStatus.Open,
      label: TicketStatus.Open.toUpperCase(),
      type: AppConstants.Status,
      active: true,
    },
    {
      ...emptyRecord,
      id: 'closed-id',
      value: TicketStatus.Closed,
      label: TicketStatus.Closed.toUpperCase(),
      type: AppConstants.Status,
      active: true,
    },
  ],
  [AppConstants.Category]: [
    {
      ...emptyRecord,
      id: 'pet_fostering-id',
      value: 'pet_fostering',
      label: 'Pet Fostering',
      type: AppConstants.Category,
      active: true,
    },
    {
      ...emptyRecord,
      value: 'pet_sitting',
      label: 'Pet Sitting',
      type: AppConstants.Category,
      active: true,
    },
  ],
};
