import { defaultClientInformation } from '@context/serviceRequest/clientInformationContext';
import { defaultPetInformation } from '@context/serviceRequest/petInformationContext';
import { defaultServiceInformation } from '@context/serviceRequest/serviceInformationContext';
import { EditableAnimalType, EditableClientType, EditableServiceRequestType } from '@types';
import { useEffect, useState } from 'react';
import * as DataService from '@services/DataService';

export type UseTicketByIdState = {
  client: EditableClientType,
  animal: EditableAnimalType,
  ticket: EditableServiceRequestType
};
export default function useTicketById(ticketId: string) {
  const [state, setState] = useState<UseTicketByIdState>({
    client: defaultClientInformation,
    animal: defaultPetInformation,
    ticket: defaultServiceInformation,
  });

  useEffect(() => {
    const getTicket = async () => {
      const ticket = await DataService.getTicket(ticketId);
      /**
       * TODO consider using Promise.allSettled
       * If one of the promises passed to Promise.all() fails,
       * then all in-progress promises are stopped and an error is thrown.
       * However using .allSettled() would allow us to gracefully handle individual query failures.
       */
      const [client, animal] = await Promise.all([
        DataService.getClientByIdOrEmail('id', ticket.client_id),
        DataService.getPetById(ticket.pet_id),
      ]);
      setState({ ticket, client, animal });
    };
    if (ticketId) getTicket();
  }, [ticketId]);

  return state;
}
