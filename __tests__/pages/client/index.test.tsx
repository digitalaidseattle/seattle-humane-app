// client/index.test.js
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Client from '../../../pages/client';
import { clientService } from '../../../src/services/ClientService';

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

    render(<Client />);

    expect(screen.getByText('Clients')).toBeInTheDocument();
    expect(tixSpy).toHaveBeenCalledTimes(1);
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


  afterEach(() => {
    jest.clearAllMocks();
  });
});