import { AppConstants } from 'src/constants';

export default function useAppConstants(type: string) {
  // moved data declaration to the bottom for readability
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return data[type];
}

const emptyRecord = {
  id: '',
  changed_at: '',
  changed_by: '',
  created_at: '',
};

export const data = {
  [AppConstants.Species]: [
    {
      ...emptyRecord,
      value: 'bird',
      label: 'BIRD',
      type: AppConstants.Species,
      active: true,
    },
    {
      ...emptyRecord,
      value: 'dog',
      label: 'DOG',
      type: AppConstants.Species,
      active: true,
    },
  ],
  [AppConstants.Source]: [
    {
      ...emptyRecord,
      value: 'phone',
      label: 'PHONE',
      type: AppConstants.Source,
      active: true,
    },
    {
      ...emptyRecord,
      value: 'walkin',
      label: 'Walk-in',
      type: AppConstants.Source,
      active: true,
    },
  ],
  [AppConstants.Status]: [
    {
      ...emptyRecord,
      value: 'open',
      label: 'Open',
      type: AppConstants.Status,
      active: true,
    },
    {
      ...emptyRecord,
      value: 'in_progress',
      label: 'IN PROGRESS',
      type: AppConstants.Status,
      active: true,
    },
  ],
  [AppConstants.Category]: [
    {
      ...emptyRecord,
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
