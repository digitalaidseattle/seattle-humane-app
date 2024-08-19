import type { UseTicketByIdState } from '@hooks/useTicketById';
import { mockClient, mockPet, mockTicket } from '@utils/TestData';

const useTicketById: (id: string) => UseTicketByIdState = jest.fn(() => ({
  ticket: mockTicket,
  client: mockClient,
  animal: mockPet,
}));

export default useTicketById;
