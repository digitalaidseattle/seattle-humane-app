/* eslint-disable no-await-in-loop */
import {
  CustomServiceRequestType,
} from '@context/serviceRequest/serviceInformationContext';
import * as DataService from '@services/DataService';
import {
  EditablePetType,
  EditableClientType,
  ServiceRequestType,
  PetType,
} from '@types';

export default async function handleTicketCreation(
  requests: CustomServiceRequestType[],
  client: EditableClientType,
  pets: EditablePetType[],
): Promise<ServiceRequestType[]> {
  // If every request doesn't have at least 1 pet associated
  if (!requests.every((req) => pets.some((_, i) => req.selected_pets.includes(i)))) {
    throw new Error('Cannot create request without associating a pet');
  }

  let clientId: string;

  // Check if client exists and create one if not
  // No Upsert operations currently in the supabaseClient library AFAIK
  const existingClient = await DataService.getClientByIdOrEmail(
    'email',
    client.email,
  );
  // TODO: Deal with modifying client information if it already exists
  if (!existingClient) {
    const newClient = await DataService.createClient(client);
    clientId = newClient.id;
  } else clientId = existingClient.id;

  // Collect all ticket promises in a flat array
  const ticketPromises: Promise<ServiceRequestType>[] = [];

  // Check if each pet exists and create one if not
  const savedPetData = new Map<number, PetType>();
  for (let petIndex = 0; petIndex < pets.length; petIndex += 1) {
    const petInput = pets[petIndex];
    let savedPet = await DataService.getPetByOwner(clientId, petInput.name);
    if (!savedPet) savedPet = await DataService.createAnimal(petInput, clientId);
    savedPetData.set(petIndex, savedPet);
  }

  requests.forEach((request) => {
    // Create tickets for this pet
    pets.forEach(async (pet, petIndex) => {
      if (!request.selected_pets.includes(petIndex)) return;
      const savedPet = savedPetData.get(petIndex);
      if (!savedPet) throw new Error(`Error while creating the "${request.service_category}" request for pet "ø${pet.name}": Unable to find or save the pet information.`);
      const petId = savedPet.id;
      ticketPromises.push(DataService.createTicket(request, clientId, petId));
    });
  });
  return Promise.all(ticketPromises);
  // TODO: ChangeLog not currently implemented
}
