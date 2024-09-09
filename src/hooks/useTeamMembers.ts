import * as DataService from '@services/DataService';
import useSWR from 'swr';

export default function useTeamMembers() {
  const { data, isLoading, isValidating } = useSWR('dataservice/team_members', async () => DataService.getTeamMembers());

  return {
    data: data ?? [], isLoading, isValidating,
  };
}
