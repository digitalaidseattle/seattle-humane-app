import { AppConstants } from 'src/constants';
import * as DataService from '@services/DataService';
import useSWR from 'swr';

export default function useAppConstants(type: AppConstants) {
  const { data, isLoading } = useSWR('dataService/appConstants', async () => DataService.getAppConstants(type));

  return { data, isLoading };
}
