/* eslint-disable @typescript-eslint/no-use-before-define */
import { useReducer, useState } from 'react';
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
  customServiceRequestType,
} from '@context/serviceRequest/serviceInformationContext';
import useTicketById from '@hooks/useTicketById';
import * as DataService from '@services/DataService';
import {
  EditablePetType,
  EditableClientType,
  EditableServiceRequestType,
  ServiceRequestType,
} from '@types';

export default function useServiceRequestForm(
  ticketId: ServiceRequestType['id']
) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const {
    client: savedClient,
    pet: savedPet,
    ticket: savedTicket,
  } = useTicketById(ticketId);

  //* Get state and dispatchers for the from sections
  const [newClient, clientInformationDispatch] = useReducer(
    clientInfoReducer,
    defaultClientInformation
  );

  const [newPets, petInformationDispatch] = useReducer(petInfoReducer, [
    defaultPetInformation,
  ]);

  const [newTicket, serviceInformationDispatch] = useReducer(
    serviceInfoReducer,
    [defaultServiceInformation]
  );

  const dataState = { client: newClient, pets: newPets, tickets: newTicket };
  if (ticketId) {
    if (!readOnly) setReadOnly(true);
    dataState.client = savedClient;
    dataState.pets = [savedPet];
    dataState.tickets = [{ ...savedTicket, selected_pets: [] }];
  } else {
    if (readOnly) setReadOnly(false);
    dataState.client = newClient;
    dataState.pets = newPets;
    dataState.tickets = newTicket;
  }

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
      await handleTicketCreation(newTicket, newClient, newPets);
      return true;
    } catch (e) {
      setMessage(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  };

  return {
    readOnly,
    disabled: readOnly || busy,
    clearForm,
    save,
    message,
    clientInformationDispatch,
    petInformationDispatch,
    serviceInformationDispatch,
    ...dataState,
  };
}

async function handleTicketCreation(
  requests: customServiceRequestType[],
  client: EditableClientType,
  pets: EditablePetType[]
): Promise<ServiceRequestType[]> {
  let clientId: string;

  // Check if client exists and create one if not
  // No Upsert operations currently in the supabaseClient library AFAIK
  const existingClient = await DataService.getClientByIdOrEmail(
    'email',
    client.email
  );
  // TODO: Deal with modifying client information if it already exists
  if (!existingClient) {
    const newClient = await DataService.createClient(client);
    clientId = newClient.id;
  } else clientId = existingClient.id;

  // Collect all ticket promises in a flat array
  const ticketPromises: Promise<ServiceRequestType>[] = [];

  requests.forEach((request) => {
    // Create tickets for this pet
    pets.filter((_, petIndex) => request.selected_pets.includes(petIndex))
      .forEach(async (pet) => {
      let petId: string;
      // Check if pet exists and create one if not
      const existingPet = await DataService.getPetByOwner(clientId, pet.name);
      if (!existingPet) {
        const newPet = await DataService.createAnimal(pet, clientId);
        petId = newPet.id;
      } else {
        petId = existingPet.id;
      }
      ticketPromises.push(DataService.createTicket(request, clientId, petId));
    })
  });
  return Promise.all(ticketPromises);
  // TODO: ChangeLog not currently implemented
}
