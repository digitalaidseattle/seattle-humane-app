import { recentCases } from '@hooks/__mocks__/useRecentTickets';
import useRecentTickets from '@hooks/useRecentTickets';
import ClientService, { PageInfo } from '@services/ClientService';
import { renderHook, waitFor } from '@testing-library/react';
import { ServiceRequestSummary } from '@types';

jest.mock('@services/ClientService');
const mockedClientService = jest.mocked(ClientService);

beforeAll(() => {
  // Setup mock ClientService
  // FIXME this could be cleaned up
  const page: PageInfo<ServiceRequestSummary> = { totalRowCount: 2, rows: recentTickets };
  mockedClientService.getServiceRequestSummary.mockImplementation(async () => page);
});

it('returns the tickets from the db', async () => {
  //* Act
  const { result } = renderHook(useRecentTickets);
  //* Assert
  await waitFor(() => {
    expect(mockedClientService.getServiceRequestSummary).toHaveBeenCalled();
    expect(result.current).toEqual(recentCases);
  });
});
