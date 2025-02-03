/* eslint-disable @typescript-eslint/no-use-before-define */
import { useReducer, useState } from 'react';
import {
  ClientInfoActionType, clientInfoReducer, defaultClientInformation,
} from '@context/serviceRequest/clientInformationContext';
import {
  petInfoReducer, defaultPetInformation, PetInfoActionType,
} from '@context/serviceRequest/petInformationContext';
import {
  serviceInfoReducer, defaultServiceInformation, ServiceInfoActionType,
} from '@context/serviceRequest/serviceInformationContext';
import useTicketById from '@hooks/useTicketById';
import * as DataService from '@services/DataService';
import {
  EditableAnimalType, EditableClientType, EditableServiceRequestType, ServiceRequestType,
} from '@types';

export default function useServiceRequestForm(ticketId: ServiceRequestType['id']) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const { client: savedClient, animal: savedAnimal, ticket: savedTicket } = useTicketById(ticketId);

  //* Get state and dispatchers for the from sections
  const [
    newClient, clientInformationDispatch,
  ] = useReducer(clientInfoReducer, defaultClientInformation);

  const [
    newPets, petInformationDispatch,
  ] = useReducer(petInfoReducer, [defaultPetInformation]);

  const [
    newTicket, serviceInformationDispatch,
  ] = useReducer(serviceInfoReducer, defaultServiceInformation);

  const dataState = { client: newClient, pets: newPets, ticket: newTicket };
  if (ticketId) {
    if (!readOnly) setReadOnly(true);
    dataState.client = savedClient;
    dataState.pets = [savedAnimal];
    dataState.ticket = savedTicket;
  } else {
    if (readOnly) setReadOnly(false);
    dataState.client = newClient;
    dataState.pets = newPets;
    dataState.ticket = newTicket;
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
      await handleTicketCreation(
        newTicket,
        newClient,
        newPets,
      );
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
  request: EditableServiceRequestType,
  client: EditableClientType,
  animals: EditableAnimalType[],
)
  : Promise<ServiceRequestType[]> {
  let clientId: string;

  // Check if client exists and create one if not
  // No Upsert operations currently in the supabaseClient library AFAIK
  const existingClient = await DataService.getClientByIdOrEmail('email', client.email);
  // TODO: Deal with modifying client information if it already exists
  if (!existingClient) {
    const newClient = await DataService.createClient(client);
    clientId = newClient.id;
  } else clientId = existingClient.id;

  const ticketPromises = animals.map(async (animal) => {
    let animalId: string;

    // Check if animal exists and create one if not
    const existingAnimal = await DataService.getPetByOwner(clientId, animal.name);
    if (!existingAnimal) {
      const newAnimal = await DataService.createAnimal(animal, clientId);
      animalId = newAnimal.id;
    } else {
      animalId = existingAnimal.id;
    }

    // Create and return new ticket
    return DataService.createTicket(request, clientId, animalId);
  });
  return Promise.all(ticketPromises);
  // TODO: ChangeLog not currently implemented
}
