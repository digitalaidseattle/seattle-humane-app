import useAllTickets from '@hooks/useAllTickets';
import * as DataService from '@services/DataService';
import { renderHook, waitFor } from '@testing-library/react';
import { mockServiceRequestSummaries } from '@utils/TestData';

jest.mock('@services/DataService');
const mockedDataService = jest.mocked(DataService);

it('returns the tickets from the db', async () => {
  //* Act
  const { result } = renderHook(useAllTickets);
  //* Assert
  await waitFor(() => {
    expect(mockedDataService.getServiceRequestSummary).toHaveBeenCalled();
    expect(result.current).toEqual(mockServiceRequestSummaries);
  });
});
