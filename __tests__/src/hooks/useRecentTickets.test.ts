import { recentTickets } from '@hooks/__mocks__/useRecentTickets';
import useRecentTickets from '@hooks/useRecentTickets';
import ClientService from '@services/ClientService';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@services/ClientService');
const mockedClientService = jest.mocked(ClientService);

beforeAll(() => {
  // Setup mock ClientService
  mockedClientService.getServiceRequestSummary.mockImplementation(async () => recentTickets);
});

it('returns the tickets from the db', async () => {
  //* Act
  const { result } = renderHook(useRecentTickets);
  //* Assert
  await waitFor(() => {
    expect(mockedClientService.getServiceRequestSummary).toHaveBeenCalled();
    expect(result.current).toEqual(recentTickets);
  });
});
