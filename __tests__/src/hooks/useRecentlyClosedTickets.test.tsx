import { MockAppConstants } from '@hooks/__mocks__/useAppConstants';
import useRecentlyClosedTickets from '@hooks/useRecentlyClosedTickets';
import { renderHook, waitFor } from '@testing-library/react';
import { mockServiceRequestSummaries } from '@utils/TestData';
import { TicketStatus } from 'src/constants';
import useSWR from 'swr';

jest.mock('@services/DataService');
jest.mock('swr');

const closedTicketId = MockAppConstants.status
  .find((({ value }) => value === TicketStatus.Closed)).id;

describe('useRecentlyClosedTickets', () => {
  it('returns closed tickets, sorted by date, from the db', async () => {
    // Arrange
    const mockClosedTickets = mockServiceRequestSummaries
      .filter((t) => t.status === closedTicketId);

    (useSWR as jest.Mock).mockReturnValue({
      data: mockClosedTickets,
      isLoading: false,
    });

    // Act
    const { result } = renderHook(useRecentlyClosedTickets);
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert
    /** Ensure there is actually enough mock test data to filter closed tickets from the rest */
    expect(mockServiceRequestSummaries.length).toBeGreaterThan(0);
    expect(mockClosedTickets.length).toBeGreaterThan(0);
    expect(mockClosedTickets.length).toBeLessThan(mockServiceRequestSummaries.length);
    mockClosedTickets.forEach((ticket) => { expect(result.current.data).toContainEqual(ticket); });

    /** Sanity check for sort */
    const firstTicket = result.current.data[0];
    const firstTicketTimestamp = new Date(firstTicket.created_at).valueOf();
    const lastTicket = result.current.data[result.current.data.length - 1];
    const lastTicketTimestamp = new Date(lastTicket.created_at).valueOf();
    expect(firstTicketTimestamp).toBeGreaterThan(lastTicketTimestamp);
  });

  it('sets up auto-refresh with correct interval', () => {
    // Act
    renderHook(useRecentlyClosedTickets);

    // Assert
    expect(useSWR).toHaveBeenCalledWith(
      'dataservice/recentlyclosedtickets',
      expect.any(Function),
      expect.objectContaining({
        refreshInterval: 30000,
      }),
    );
  });
});
