import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import ServiceRequestDialog from '@components/serviceRequest/ServiceRequestDialog';
import { LayoutContext } from '../../layout/context/layoutcontext';
import AppMenu from '../../layout/AppMenu';
import '@testing-library/jest-dom';

// Mock the LayoutContext provider

jest.mock('../../layout/context/layoutcontext', () => {
  const MockLayoutContext = React.createContext(null);
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
/* Ran all test suites matching /__tests__\/layout\/AppMenu.test.tsx/i.
/Users/tristansanjuan/Desktop/Projects/seattle-humane-app/src/services/AppService.ts:54
                throw new Error("No app constants found.");
                      ^

Error: No app constants found.
    at /Users/tristansanjuan/Desktop/Projects/seattle-humane-app/src/services/AppService.ts:54:23
    at processTicksAndRejections (node:internal/process/task_queues:95:5) */

// jest.mock('src/services/AppService', () => ({
//   getAppConstants: (): Promise<AppConstant[]> => Promise.resolve([{
//     value: 'Test App',
//     label: 'Test App',
//   }]),
// }));

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
};

jest.mock('next/router', () => jest.requireActual('next-router-mock'));

describe('Menu Items Check', () => {
  test('renders AppMenu component', () => {
    const { getByText } = render(
      <LayoutContext.Provider value={layoutContextValue}>
        <AppMenu />
      </LayoutContext.Provider>,
    );

    // Check that the Dashboard menu item is rendered
    expect(getByText('Dashboard')).toBeInTheDocument();
    // Check that the Clients menu item is rendered
    expect(getByText('Clients')).toBeInTheDocument();
    // Check that the Animals menu item is rendered
    expect(getByText('Animals')).toBeInTheDocument();
    // Check that the Reports menu item is rendered
    expect(getByText('Reports')).toBeInTheDocument();
    // Check that the New Request menu item is rendered
    expect(getByText('New Request')).toBeInTheDocument();
    // Check that the Profile menu item is rendered
    expect(getByText('Profile')).toBeInTheDocument();
  });

  test('New Request Icon can open ServiceRequest modal', () => {
    const dialog = 'newServiceRequest';
    const onClose = jest.fn();
    render(
      <LayoutContext.Provider value={layoutContextValue}>
        <AppMenu />
        <ServiceRequestDialog
          visible={dialog === 'newServiceRequest'}
          onClose={onClose}
        />
      </LayoutContext.Provider>,
    );

    const newRequestLink = screen.getByText(/New Request/i);
    // Wrap clicking newRequestLink in act() to avoid React state update warning
    fireEvent.click(newRequestLink);

    const clientInformationHeaders = screen.getAllByRole('heading', {
      name: /client information/i,
    });
    expect(clientInformationHeaders[0]).toBeInTheDocument();
  });
});
