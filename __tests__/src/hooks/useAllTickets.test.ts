import useAllTickets from '@hooks/useAllTickets';
import { renderHook, waitFor } from '@testing-library/react';
import { mockServiceRequestSummaries } from '@utils/TestData';

jest.mock('@services/DataService');

it('returns the tickets from the db', async () => {
  //* Act
  const { result } = renderHook(useAllTickets);
  //* Assert
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
  expect(result.current.data).toEqual(mockServiceRequestSummaries);
});
