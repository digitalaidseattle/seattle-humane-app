/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  customServiceRequestType,
} from '@context/serviceRequest/serviceInformationContext';
import * as DataService from '@services/DataService';
import {
  EditablePetType,
  EditableClientType,
  ServiceRequestType,
} from '@types';


export default async function handleTicketCreation(
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
