import { render, screen } from '@testing-library/react';
import Page from "@pages/new-service-request";
import { useSearchParams } from 'next/navigation';
import '@testing-library/jest-dom';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

const mockedUseSearchParams = useSearchParams as jest.Mock;

describe('new service request page', () => {
  it("render the page that's been submitted", () => {
    mockedUseSearchParams.mockImplementation(() => ({
      get: (t) => 'true'
    }));
    render(<Page />);
    expect(screen.getByText(
      'Your request has been submitted, thank you!'
    )).toBeInTheDocument();
    expect(screen.queryByLabelText(
      'Submit'
    )).not.toBeInTheDocument();
  });
  
  it("render the page that's not been submitted", () => {
    mockedUseSearchParams.mockImplementation(() => ({
      get: (t) => 'false'
    }));
    render(<Page />);
    expect(screen.getByText('New Service Request')).toBeInTheDocument();
    expect(screen.getByLabelText(
      'Submit'
    )).toBeInTheDocument();
  });
  
});

