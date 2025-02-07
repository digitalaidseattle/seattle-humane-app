import * as DataService from '@services/DataService';
import {
  ServiceRequestType,
  ClientType,
  PetType,
} from '@types';

type TicketUpdateResult = {
  message: string,
  ticket?: ServiceRequestType,
  client?: ClientType,
  pet?: PetType
};

export default async function handleTicketUpdate(
  ticketInputs: (ServiceRequestType)[],
  clientInput: ClientType,
  petInputs: PetType[],
): Promise<TicketUpdateResult> {
  // Locate the corresponding ticket by the existing information
  // client by email, pet by owner id and name, svc req by client, pet and ticketid
  const existingClient = await DataService.getClientByIdOrEmail(
    'email',
    clientInput.email,
  );
  if (!existingClient) throw new Error(`Could not locate a client with email address ${clientInput.email}`);
  const clientId = existingClient.id;

  if (petInputs.length !== 1) throw new Error('Update is only implemented for a single pet');
  const [petInput] = petInputs;
  const existingPet = await DataService.getPetById(petInput.id);
  if (!existingPet) throw new Error(`Could not locate a pet for client with email address ${clientInput.email}`);
  const petId = existingPet.id;

  if (ticketInputs.length !== 1) throw new Error('Update is only implemented for a single ticket');
  const [ticketInput] = ticketInputs;
  if (!ticketInput) throw new Error(`Could not locate a ticket with ID ${ticketInput.id}`);
  const existingTicket = await DataService.getTicket(ticketInput.id);

  // All necessary data exists, validate the ticket is for the client and the pet
  if (existingTicket.client_id !== clientId) throw new Error(`Cannot update the ticket as the ticket is not for the client with email ${existingClient.email}`);
  if (existingTicket.pet_id !== petId) throw new Error(`Cannot update the ticket as the ticket is not for the pet named "${existingPet.name}" of client with email ${existingClient.email}`);
  const [updateClientResult, updatePetResult, updateTicketResult] = await Promise.allSettled([
    DataService.updateClient(clientInput),
    DataService.updateAnimal(clientInput, petInput),
    DataService.updateTicket(ticketInput),
  ]);
  const messages = [];
  const updateResult: TicketUpdateResult = {
    message: '',
  };
  if (updateClientResult.status !== 'fulfilled') {
    messages.push(updateClientResult.reason);
  } else updateResult.client = updateClientResult.value;

  if (updateTicketResult.status !== 'fulfilled') {
    messages.push(updateTicketResult.reason);
  } else updateResult.ticket = updateTicketResult.value;

  if (updatePetResult.status !== 'fulfilled') {
    messages.push(updatePetResult.reason);
  } else updateResult.pet = updatePetResult.value;

  if (messages.length) {
    updateResult.message = `The update was not fully successful: ${messages.join(' ')}`;
  } else {
    updateResult.message = 'Successfully saved the information';
  }

  return updateResult;
}
