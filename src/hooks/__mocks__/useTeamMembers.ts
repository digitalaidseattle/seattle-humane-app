import type { TeamMeberOption } from '@hooks/useTeamMembers';
import { mockTeamMember1, mockTeamMember2, mockTeamMember3 } from '@utils/TestData';

export const mockTeamMemberOptions = [mockTeamMember1, mockTeamMember2, mockTeamMember3];
export default function useTeamMembers(): TeamMeberOption[] {
  return mockTeamMemberOptions.map((tm) => ({
    value: tm.id,
    label: tm.email,
  }));
}
