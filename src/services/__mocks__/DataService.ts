// TODO remove after moving to prettier

import { ClientType } from '@types';
import {
  mockClient,
  mockClients, mockPet, mockPets, mockTicket, mockTickets, testGetServiceRequestSummaryFromTicket,
} from '@utils/TestData';

export const createClient = jest.fn().mockResolvedValue(mockClient);

export const getClientByIdOrEmail = jest
  .fn((key, value) => mockClients.find((c) => c[key] === value));

export const createAnimal = jest.fn().mockResolvedValue(mockPet);

export const getPetById = jest.fn((id) => mockPets.find((p) => p.id === id));

export const getPetByOwner = jest
  .fn((owner: ClientType) => mockPets.find((p) => p.client_id === owner.id));

export const createTicket = jest.fn().mockResolvedValue(mockTicket);

export const getTicket = jest.fn((id) => mockTickets.find((t) => t.id === id));

// eslint-disable-next-line max-len
export const getServiceRequestSummary = jest.fn(async () => mockTickets.map((t) => testGetServiceRequestSummaryFromTicket(t)));
