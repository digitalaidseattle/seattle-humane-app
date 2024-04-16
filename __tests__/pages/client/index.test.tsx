// client/index.test.js
import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import Client from '../../../pages/client';
import { clientService } from '../../../src/services/ClientService';
import { useRouter } from 'next/navigation';
import { RequestType as ServiceRequestType } from '../../../src/types';

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push,
  }))
}));

const statuses = [{ value: 'open', label: 'Open' }];
const sources = [{ value: 'phone', label: 'Phone' }];
const categories = [{ value: 'pet_fostering', label: 'Pet Fostering' }];
jest.mock('src/services/useAppConstants', () => {
  return {
    useAppConstants: (value) => {
      switch (value) {
        case 'status':
          return { data: statuses }
        case 'source':
          return { data: sources }
        case 'category':
          return { data: categories }
        default:
          return { data: [] }
      }
    }
  }
});

jest.mock('../../../src/services/ClientService', () => {
  return {
    clientService: {
      getTicket: jest.fn((_ticketNo) => { }),
    }
  }
});

describe('Client', () => {

  it('renders without crashing', () => {
    render(<Client />);
    expect(screen.getByText('Clients')).toBeInTheDocument();
  });

  it('renders getting DB', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '?ticketNo=t123' },
    });
    const tixSpy = jest.spyOn(clientService, 'getTicket')

    render(<Client />);

    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(tixSpy).toHaveBeenCalledTimes(1);
    expect(tixSpy).toHaveBeenCalledWith('t123');
  });

  it('click breadcrumb', () => {
    render(<Client />);
    screen.getByText('Clients').click();
    expect(push).toHaveBeenCalledWith('/clients')
  });

  it('render category drop down', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '?ticketNo=t123' },
    });

    const tix: ServiceRequestType = {} as unknown as ServiceRequestType;

    const tixSpy = jest.spyOn(clientService, 'getTicket')
      .mockReturnValue(Promise.resolve(tix));

    render(<Client />);
    expect(tixSpy).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      // I'd look for a real text here that is renderer when the data loads
      expect(screen.getByText('Service Category')).toBeDefined();
    })
    const drop = screen.getByTitle('Service category options');
    expect(drop).toBeInTheDocument()

    // selecting a dropdown will have to be covered later (not obvious how to do it)
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});