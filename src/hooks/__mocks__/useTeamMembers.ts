export const john = { value: 'abc', label: 'john@test.digitalseattle.org' };
export const jane = { value: 'xyz', label: 'jane@test.digitalseattle.org' };
export const teamMembers = [jane, john];
export default function useTeamMembers() {
  return teamMembers;
}
