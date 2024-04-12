// client/index.test.js
import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import Client from '../../../pages/client';
import { clientService } from '../../../src/services/ClientService';
import { useRouter } from 'next/navigation';
import { RequestType as ServiceRequestType } from '../../../src/types';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
  }))
}));

const species = [{ value: 'bird', label: 'BIRD' }];
const statuses = [{ value: 'open', label: 'Open' }];
const sources = [{ value: 'phone', label: 'Phone' }];
const categories = [{ value: 'pet_adoption', label: 'Pet Adoption' }];
jest.mock('src/services/useAppConstants', () => {
  const orig = jest.requireActual('src/services/useAppConstants')
  return {
    ...orig,
    useAppConstants: (value) => {
      switch (value) {
        case 'species':
          return { data: species }
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
    const tixSpy = jest.spyOn(clientService, 'getServiceRequest')

    render(<Client />);

    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(tixSpy).toHaveBeenCalledTimes(1);
    expect(tixSpy).toHaveBeenCalledWith('t123');
  });

  it('click breadcrumb', () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockImplementation(() => ({
      push
    }));

    render(<Client />);
    screen.getByText('Clients').click();
    expect(push).toHaveBeenCalledWith('/clients')
  });

  it('render category drop down', async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '?ticketNo=t123' },
    });

    const tix: ServiceRequestType = {} as ServiceRequestType;

    const tixSpy = jest.spyOn(clientService, 'getServiceRequest')
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