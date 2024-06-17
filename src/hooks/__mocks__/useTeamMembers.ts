export const john = { id: 'j456', value: 'abc', label: 'john@test.digitalseattle.org' };
export const jane = { id: 'j123', value: 'xyz', label: 'jane@test.digitalseattle.org' };
export const teamMembers = [jane, john];
export default function useTeamMembers() {
  return teamMembers;
}
