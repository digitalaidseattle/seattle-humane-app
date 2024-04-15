import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LayoutContext } from '../../layout/context/layoutcontext';
import AppTopbar from '../../layout/AppTopbar';
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
jest.mock('../../layout/context/layoutcontext', () => {
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

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

test('navigates to "/animals" when Animals button is clicked', () => {
  const layoutContextValue: LayoutContextType = {
    layoutState: {
      staticMenuDesktopInactive: false,
      overlayMenuActive: false,
      profileSidebarVisible: false,
      configSidebarVisible: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    },
    showProfileSidebar: jest.fn(),
  };

  render(
    <LayoutContext.Provider value={layoutContextValue}>
      <AppTopbar />
    </LayoutContext.Provider>,
  );

  const animalsLink = screen.getByRole('link', { name: /Animals/i });
  userEvent.click(animalsLink);

  console.log(animalsLink.hasAttribute('href'));
  console.log(animalsLink.href, ": href of the link");
  console.log(global.window.location.pathname);
  console.log(animalsLink.getAttribute('href'), ": href of the link");
  console.log(animalsLink);
  expect(animalsLink.getAttribute('href')).toEqual('/animals');
});
