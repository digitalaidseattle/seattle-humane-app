import { mockAnimal, mockClient, mockTicket } from '@hooks/__mocks__/useTicketById';
import useTicketById from '@hooks/useTicketById';
import AnimalService from '@services/AnimalService';
import ClientService from '@services/ClientService';
import { renderHook, waitFor } from '@testing-library/react';

jest.mock('@services/ClientService');
const mockedClientService = jest.mocked(ClientService);
jest.mock('@services/AnimalService');
const mockedAnimalService = jest.mocked(AnimalService);

beforeAll(() => {
  // Setup mock ClientService
  const mockGetTicket: typeof ClientService.getTicket = async (id) => {
    if (id === mockTicket.id) return mockTicket as any;
    return null;
  };
  mockedClientService.getTicket.mockImplementation(mockGetTicket);
  const mockGetClientByKeyValue: typeof ClientService.getClientByKeyValue = async (key, value) => {
    if (key === 'id' && value === mockClient.id) return mockClient as any;
    return null;
  };
  mockedClientService.getClientByKeyValue.mockImplementation(mockGetClientByKeyValue);
  const mockGetAnimal: typeof AnimalService.get = async (key, value) => {
    if (key === 'id' && value === mockAnimal.id) return mockAnimal as any;
    return null;
  };
  mockedAnimalService.get.mockImplementation(mockGetAnimal);
});

it('returns the ticket, client and pet from the db', async () => {
  // Arrange
  const expected = { ticket: mockTicket, client: mockClient, animal: mockAnimal };
  // Act
  const { result } = renderHook(useTicketById, { initialProps: mockTicket.id });
  // Assert
  await waitFor(() => {
    expect(mockedClientService.getTicket).toHaveBeenCalledWith(mockTicket.id);
    expect(result.current).toEqual(expected);
  });
});
