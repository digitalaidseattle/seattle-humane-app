import React from 'react';
import { render, screen } from '@testing-library/react';
import { LayoutContext } from '@layout/context/layoutcontext';
import AppTopbar from '@layout/AppTopbar';
import '@testing-library/jest-dom';

// Mock the LayoutContext provider
interface LayoutContextType {
  layoutState: {
    staticMenuDesktopInactive: boolean;
    overlayMenuActive: boolean;
    profileSidebarVisible: boolean;
    configSidebarVisible: boolean;
    staticMenuMobileActive: boolean;
    menuHoverActive: boolean;
  };
  showProfileSidebar: () => void;
}
jest.mock('@layout/context/layoutcontext', () => {
  const MockLayoutContext = React.createContext<LayoutContextType>(null);
  return { LayoutContext: MockLayoutContext };
});

jest.mock('next/config', () => ({
  __esModule: true,
  default: () => ({
    publicRuntimeConfig: {
      contextPath: '/shs',
    },
  }),
}));

const layoutContextValue = {
  layoutState: {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  },
  showProfileSidebar: jest.fn(),
  layoutConfig: {
    ripple: true,
    inputStyle: '',
    menuMode: '',
    colorScheme: '',
    theme: '',
    scale: 0,
  },
};

jest.mock('next/router', () => jest.requireActual('next-router-mock'));
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

describe('Navigation/Menu Top Bar - Href Checks', () => {
  test('Dashboard button/link has correct href attribute', () => {
    render(
      <LayoutContext.Provider value={layoutContextValue}>
        <AppTopbar />
      </LayoutContext.Provider>,
    );

    const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });

    expect(dashboardLink.getAttribute('href')).toEqual('/');
  });

  test('Seattle Human Icon has correct href attribute', () => {
    render(
      <LayoutContext.Provider value={layoutContextValue}>
        <AppTopbar />
      </LayoutContext.Provider>,
    );

    const homeLink = screen.getByRole('link', {
      name: /seattle humane/i,
    });

    expect(homeLink).toHaveAttribute('href', '/');
  });
});
