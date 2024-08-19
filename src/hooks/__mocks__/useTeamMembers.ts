import type { TeamMeberOption } from '@hooks/useTeamMembers';
import { mockTeamMemberOptions } from '@utils/TestData';

export default function useTeamMembers(): TeamMeberOption[] {
  return mockTeamMemberOptions.map((tm) => ({
    value: tm.id,
    label: tm.email,
  }));
}
