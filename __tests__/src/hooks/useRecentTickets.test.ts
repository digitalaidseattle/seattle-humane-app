import { recentTickets } from '@hooks/__mocks__/useRecentTickets';
import useRecentTickets from '@hooks/useRecentTickets';
import ClientService from '@services/ClientService';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@services/ClientService');
const mockedClientService = jest.mocked(ClientService);

beforeAll(() => {
  // Setup mock ClientService
  mockedClientService.getRecentTickets.mockImplementation(async () => recentTickets);
});

it('returns the tickets from the db', async () => {
  //* Act
  const { result } = renderHook(useRecentTickets);
  //* Assert
  await waitFor(() => {
    expect(mockedClientService.getRecentTickets).toHaveBeenCalled();
    expect(result.current).toEqual(recentTickets);
  });
});
