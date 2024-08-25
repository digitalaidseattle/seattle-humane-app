import { mockAnimal, mockClient, mockTicket } from '@hooks/__mocks__/useTicketById';
import useTicketById from '@hooks/useTicketById';
import * as DataService from '@services/DataService';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@services/DataService');
const mockedDataService = jest.mocked(DataService);

beforeAll(() => {
  // Setup mock DataService
  const mockGetTicket: typeof DataService.getTicket = async (id) => {
    if (id === mockTicket.id) return mockTicket as any;
    return null;
  };
  mockedDataService.getTicket.mockImplementation(mockGetTicket);
  const mockGetClientByIdOrEmail: typeof DataService.getClientByIdOrEmail = async (key, value) => {
    if (key === 'id' && value === mockClient.id) return mockClient as any;
    return null;
  };
  mockedDataService.getClientByIdOrEmail.mockImplementation(mockGetClientByIdOrEmail);
  const mockGetAnimal: typeof DataService.getPetById = async (id) => {
    if (id === mockAnimal.id) return mockAnimal as any;
    return null;
  };
  mockedDataService.getPetById.mockImplementation(mockGetAnimal);
});

it('returns the ticket, client and pet from the db', async () => {
  // Arrange
  const expected = { ticket: mockTicket, client: mockClient, animal: mockAnimal };
  // Act
  const { result } = renderHook(useTicketById, { initialProps: mockTicket.id });
  // Assert
  await waitFor(() => {
    expect(mockedDataService.getTicket).toHaveBeenCalledWith(mockTicket.id);
    expect(result.current).toEqual(expected);
  });
});
