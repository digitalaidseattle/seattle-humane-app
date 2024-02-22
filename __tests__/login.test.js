// LoginPage.test.js
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../pages/auth/login/index';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { UserContext } from '../src/context/usercontext';
import { useRouter } from 'next/router';
import { publicRuntimeConfig } from '../next.config';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    contextPath: '',
  },
}));

jest.mock('../utils/supabaseClient', () => ({
  auth: {
    onAuthStateChange: jest.fn(),
    getUser: jest.fn(),
  },
}));

describe('LoginPage', () => {
  it('renders without crashing', () => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    render(
      <LayoutProvider>
        <UserContext.Provider value={{ user: null, setUser: jest.fn() }}>
          <LoginPage />
        </UserContext.Provider>
      </LayoutProvider>
    );
    
    expect(screen.getByText('Pet Assistance and Welfare System')).toBeInTheDocument();
  });
  it('renders Sign-in Microsoft Button', () => {
    useRouter.mockImplementation(() => ({
      push: jest.fn(),
    }));

    render(
      <LayoutProvider>
        <UserContext.Provider value={{ user: null, setUser: jest.fn() }}>
          <LoginPage />
        </UserContext.Provider>
      </LayoutProvider>
    );
    
    expect(screen.getByLabelText('Sign in with Microsoft')).toBeInTheDocument();
  });

});

