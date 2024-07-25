import { ServiceRequestType } from '@types';
import { mockTicket } from "./useTicketById";

export const mockAssignedTickets: ServiceRequestType[] = [
  {
    ...mockTicket,
    team_member_id: '4321',
  },
  {
    ...mockTicket,
    team_member_id: '4321',
  },
  {
    ...mockTicket,
    team_member_id: '4321',
  },
  {
    ...mockTicket,
    team_member_id: '100',
  },
];

const useAssignedTickets: () => ServiceRequestType[] = jest.fn(
  () => mockAssignedTickets
);

export default useAssignedTickets;
