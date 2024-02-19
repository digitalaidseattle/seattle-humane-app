// client/index.test.js
import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import Client from '../../../pages/client';
import { ClientTicket, ServiceCategory, clientService } from '../../../src/services/ClientService';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: jest.fn(),
  }))
}));

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
    const catSpy = jest.spyOn(clientService, 'getServiceCategories')
    const statSpy = jest.spyOn(clientService, 'getServiceStatuses')

    render(<Client />);

    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(tixSpy).toHaveBeenCalledTimes(1);
    expect(tixSpy).toHaveBeenCalledWith('t123');
    expect(catSpy).toHaveBeenCalledTimes(1);
    expect(statSpy).toHaveBeenCalledTimes(1);
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

    const cats = [
      new ServiceCategory({ id: 'CAT101', name: 'PET ADOPTION' }),
      new ServiceCategory({ id: 'CAT102', name: 'Pet Fostering' })]
    const tix = new ClientTicket({});

    const tixSpy = jest.spyOn(clientService, 'getTicket')
      .mockReturnValue(Promise.resolve(tix));

    const catSpy = jest.spyOn(clientService, 'getServiceCategories')
      .mockReturnValue(Promise.resolve(cats));


    render(<Client />);
    expect(tixSpy).toHaveBeenCalledTimes(1);
    expect(catSpy).toHaveBeenCalledTimes(1);

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