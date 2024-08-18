// TODO remove after moving to prettier

import { MockAppConstants } from '@hooks/__mocks__/useAppConstants';
import { ClientType } from '@types';
import {
  mockClient,
  mockClients, mockPet,
  mockPets, mockTicket,
  mockTickets, mockTicketsThisWeek,
  testGetServiceRequestSummaryFromTicket,
} from '@utils/TestData';
import { AppConstants } from 'src/constants';

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
// eslint-disable-next-line max-len
export const getTicketsThisWeek = jest.fn(() => mockTicketsThisWeek.map((t) => testGetServiceRequestSummaryFromTicket(t)));

export const getAppConstants = jest.fn((type: AppConstants) => MockAppConstants[type]);
