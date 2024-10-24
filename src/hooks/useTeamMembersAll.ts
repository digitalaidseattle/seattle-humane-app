import * as DataService from '@services/DataService';
import useSWR from 'swr';

// TODO: merge this into useteammembers and have separate function for creating options
export default function useTeamMembersAll() {
  const { data, isLoading, isValidating } = useSWR('dataservice/allteammembers', async () => DataService.getTeamMembers());

  return {
    data: data ?? [], isLoading, isValidating,
  };
}
