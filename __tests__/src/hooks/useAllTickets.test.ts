import useAllTickets from '@hooks/useAllTickets';
import { renderHook, waitFor } from '@testing-library/react';
import { mockServiceRequestSummaries } from '@utils/TestData';
import useSWR from 'swr';

jest.mock('@services/DataService');
jest.mock('swr');

describe('useAllTickets', () => {
  it('returns the tickets from the db', async () => {
    // Arrange
    (useSWR as jest.Mock).mockReturnValue({
      data: mockServiceRequestSummaries,
      isLoading: false,
    });

    // Act
    const { result } = renderHook(useAllTickets);

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toEqual(mockServiceRequestSummaries);
  });

  it('sets up auto-refresh with correct interval', () => {
    // Act
    renderHook(useAllTickets);

    // Assert
    expect(useSWR).toHaveBeenCalledWith(
      'dataservice/alltickets',
      expect.any(Function),
      expect.objectContaining({
        refreshInterval: 30000,
      }),
    );
  });
});
