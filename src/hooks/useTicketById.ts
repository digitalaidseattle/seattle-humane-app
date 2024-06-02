import { defaultClientInformation } from '@context/serviceRequest/clientInformationContext';
import { defaultPetInformation } from '@context/serviceRequest/petInformationContext';
import { defaultServiceInformation } from '@context/serviceRequest/serviceInformationContext';
import { EditableAnimalType, EditableClientType, EditableServiceRequestType } from '@types';
import { useEffect, useState } from 'react';
import ClientService from 'src/services/ClientService';

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
      const ticket = await ClientService.getTicket(ticketId);
      /**
       * TODO consider using Promise.allSettled
       * If one of the promises passed to Promise.all() fails,
       * then all in-progress promises are stopped and an error is thrown.
       * However using .allSettled() would allow us to gracefully handle individual query failures.
       */
      const [client, animal] = await Promise.all([
        ClientService.getClientByKeyValue('id', ticket.client_id),
        ClientService.getAnimalByKeyValue('id', ticket.pet_id),
      ]);
      setState({ ticket, client, animal });
    };
    if (ticketId) getTicket();
  }, [ticketId]);

  return state;
}
