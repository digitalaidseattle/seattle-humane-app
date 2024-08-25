import { faker } from '@faker-js/faker';
import type { TeamMeberOption } from '@hooks/useTeamMembers';
import type { TeamMemberType } from '@types';

faker.seed(123);
const {
  string, person, internet, date,
} = faker;
const teamMembers: TeamMemberType[] = Array.from({ length: 10 }, () => ({
  id: string.uuid(),
  first_name: person.firstName(),
  last_name: person.lastName(),
  email: internet.email(),
  created_at: date.recent().toString(),
}));
export const mockTeamMember1 = teamMembers[0];
export const mockTeamMember2 = teamMembers[1];
export const mockTeamMember3 = teamMembers[2];
export const mockTeamMemberOptions = [mockTeamMember1, mockTeamMember2, mockTeamMember3];
export default function useTeamMembers(): TeamMeberOption[] {
  return mockTeamMemberOptions.map((tm) => ({
    value: tm.id,
    label: tm.email,
  }));
}
