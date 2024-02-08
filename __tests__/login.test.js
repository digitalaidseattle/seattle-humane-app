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
    
    expect(screen.getByText('Welcome, Isabel!')).toBeInTheDocument();
  });
});