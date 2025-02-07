/* eslint-disable @typescript-eslint/no-use-before-define */
import { useEffect, useReducer, useState } from 'react';
import {
  ClientInfoActionType,
  clientInfoReducer,
  defaultClientInformation,
} from '@context/serviceRequest/clientInformationContext';
import {
  petInfoReducer,
  defaultPetInformation,
  PetInfoActionType,
} from '@context/serviceRequest/petInformationContext';
import {
  serviceInfoReducer,
  defaultServiceInformation,
  ServiceInfoActionType,
} from '@context/serviceRequest/serviceInformationContext';
import * as DataService from '@services/DataService';
import {
  ServiceRequestType,
  ClientType,
  PetType,
} from '@types';
import handleTicketUpdate from '@utils/handleTicketUpdate';
import handleTicketCreation from '@utils/handleTicketCreation';

export default function useServiceRequestForm(
  ticketId: ServiceRequestType['id'],
  visible: boolean
) {
  const [showDialog, setShowDialog] = useState(visible);

  useEffect(() => {
    setShowDialog(visible);
  }, [visible]);

  const [busy, setBusy] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true)
  const [message, setMessage] = useState('');
  const [isNewTicket, setIsNewTicket] = useState(true);

  useEffect(() => {
    async function getTicket() {
      setBusy(true)
      setIsReadOnly(true)
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
      clientInformationDispatch({ type: ClientInfoActionType.Update, partialStateUpdate: client })
      petInformationDispatch({ type: PetInfoActionType.Update, partialStateUpdate: animal, index: 0 })
      serviceInformationDispatch({ type: ServiceInfoActionType.Update, partialStateUpdate: ticket, index: 0 })
      setBusy(false)
    };
    if (ticketId) {
      setIsNewTicket(false)
      getTicket()
    } else {
      setIsReadOnly(false)
      setIsNewTicket(true)
      clearForm()
    }
  }, [ticketId]);

  //* Get state and dispatchers for the from sections
  const [client, clientInformationDispatch] = useReducer(
    clientInfoReducer,
    defaultClientInformation,
  );

  const [pets, petInformationDispatch] = useReducer(petInfoReducer, [
    defaultPetInformation,
  ]);

  const [tickets, serviceInformationDispatch] = useReducer(
    serviceInfoReducer,
    [{ ...defaultServiceInformation, selected_pets: [] }]
  );

  const dataState = { client, pets, tickets };

  const clearForm = () => {
    clientInformationDispatch({ type: ClientInfoActionType.Clear });
    petInformationDispatch({ type: PetInfoActionType.Clear });
    serviceInformationDispatch({ type: ServiceInfoActionType.Clear });
    setMessage('');
  };

  const save = async () => {
    if (busy) return false;
    setBusy(true);
    // TODO add error handling scenario
    try {
      if (ticketId) {
        handleTicketUpdate
          (tickets as unknown as ServiceRequestType[],
            client as unknown as ClientType,
            pets as unknown as PetType[]
          )
      }
      else await handleTicketCreation(tickets, client, pets);
      return true;
    } catch (e) {
      setMessage(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  return {
    showDialog,
    isNewTicket,
    isReadOnly,
    setIsReadOnly,
    save,
    busy,
    message,
    clientInformationDispatch,
    petInformationDispatch,
    serviceInformationDispatch,
    ...dataState,
  };
}
