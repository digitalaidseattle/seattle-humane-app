import useTicketById from '@hooks/useTicketById';
import * as DataService from '@services/DataService';
import { renderHook, waitFor } from '@testing-library/react';
import { mockClient, mockPet, mockTicket } from '@utils/TestData';

jest.mock('@services/DataService');
const mockedDataService = jest.mocked(DataService);

it('returns the ticket, client and pet from the db', async () => {
  // Arrange
  const expected = { ticket: mockTicket, client: mockClient, animal: mockPet };
  // Act
  const { result } = renderHook(useTicketById, { initialProps: mockTicket.id });
  // Assert
  await waitFor(() => {
    expect(mockedDataService.getTicket).toHaveBeenCalledWith(mockTicket.id);
    expect(result.current).toEqual(expected);
  });
});
