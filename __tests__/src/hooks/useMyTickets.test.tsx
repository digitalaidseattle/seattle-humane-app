import useMyTickets from '@hooks/useMyTickets';
import { UserContext } from '@context/usercontext';
import { renderHook, waitFor } from '@testing-library/react';
import { mockServiceRequestSummaries, mockTeamMember1 } from '@utils/TestData';
import { User } from '@supabase/supabase-js';
import useSWR from 'swr';

jest.mock('@services/DataService');
jest.mock('swr');

describe('useMyTickets', () => {
  const wrapper = ({ children }) => (
    <UserContext.Provider value={{
      user: { email: mockTeamMember1.email } as User,
      setUser: () => { },
    }}
    >
      {children}
    </UserContext.Provider>
  );

  it('returns the signed-in user\'s tickets from the db', async () => {
    // Arrange
    const mockMyTickets = mockServiceRequestSummaries
      .filter((t) => t.team_member.email === mockTeamMember1.email);

    (useSWR as jest.Mock).mockReturnValue({
      data: mockMyTickets,
      isLoading: false,
    });

    // Act
    const { result } = renderHook(useMyTickets, { wrapper });

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    /** Ensure there is actually enough mock test data to filter one user from the rest */
    expect(mockServiceRequestSummaries.length).toBeGreaterThan(0);
    expect(mockMyTickets.length).toBeGreaterThan(0);
    expect(mockMyTickets.length).toBeLessThan(mockServiceRequestSummaries.length);
    expect(result.current.data).toEqual(mockMyTickets);
  });

  it('sets up auto-refresh with correct interval', () => {
    // Act
    renderHook(useMyTickets, { wrapper });

    // Assert
    expect(useSWR).toHaveBeenCalledWith(
      'dataservice/mytickets',
      expect.any(Function),
      expect.objectContaining({
        refreshInterval: 30000,
      }),
    );
  });
});
