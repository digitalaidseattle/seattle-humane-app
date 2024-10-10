import useMyTickets from '@hooks/useMyTickets';
import { UserContext } from '@context/usercontext';
import { renderHook, waitFor } from '@testing-library/react';
import { mockServiceRequestSummaries, mockTeamMember1 } from '@utils/TestData';
import { User } from '@supabase/supabase-js';

jest.mock('@services/DataService');

it('returns the signed-in user\'s tickets tickets from the db', async () => {
  //* Act
  /** Hook needs the user context to find cases for the user */
  const wrapper = ({ children }) => (
    <UserContext.Provider value={{
      user: { email: mockTeamMember1.email } as User,
      setUser: () => { },
    }}
    >
      {children}
    </UserContext.Provider>
  );

  const { result } = renderHook(useMyTickets, { wrapper });

  //* Assert
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
  const mockMyTickets = mockServiceRequestSummaries
    .filter((t) => t.team_member.email === mockTeamMember1.email);
  /** Ensure there is actually enough mock test data to filter one user from the rest */
  expect(mockServiceRequestSummaries.length).toBeGreaterThan(0);
  expect(mockMyTickets.length).toBeGreaterThan(0);
  expect(mockMyTickets.length).toBeLessThan(mockServiceRequestSummaries.length);
  expect(result.current.data).toEqual(mockMyTickets);
});
