import getConfig from 'next/config';
import React, {
  useContext, useState,
} from 'react';
import ServiceRequestDialog from '@components/serviceRequest/ServiceRequestDialog';
import { useRouter } from 'next/router';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { UserContext } from '../src/context/usercontext';
import authService from '../src/services/authService';

// import pawIcon from '/images/paw.svg';
interface Item {
  label: string;
  icon?: string;
  iconSrc?: string;
  to?: string;
  class?: string;
  command?: () => void;
  title?: string;
  key?: string;
}

function AppMenu() {
  const [dialog, showDialog] = useState('');
  const onClose = () => showDialog('');
  const { user } = useContext(UserContext);
  const { contextPath } = getConfig().publicRuntimeConfig;
  const router = useRouter();
  const models: { items: (Item)[] }[] = [{
    items: [

      { label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', to: '/' },
      { label: 'Clients', icon: 'pi pi-fw pi-users', to: '/clients' },
      {
        label: 'Animals',
        iconSrc: `${contextPath}/images/paw.svg`,
        to: '/animals',
        class: 'animals-icon',
      },
      { label: 'Reports', icon: 'pi pi-fw pi-book', to: '/reports' },
      {
        label: 'New Request',
        iconSrc: `${contextPath}/images/pawClipboard.svg`,
        key: 'newServiceRequest',
        class: 'new-request-icon',
        command: () => {
          if (!dialog) showDialog('newServiceRequest');
        },
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        to: '/auth/login',
        title: user?.email || 'user',
        command: () => {
          authService.signOut().then(() => {
            router.push('/auth/login');
          });
        },
      },
    ],
  }];

  return (
    <>
      <MenuProvider>
        <ul className="layout-menu">
          {models.map((model, i) => (
            <AppMenuitem item={model} root index={i} key="root-menu" />
          ))}
        </ul>
      </MenuProvider>
      {/* Modal opening and closing */}
      <ServiceRequestDialog
        visible={dialog === 'newServiceRequest'}
        onClose={onClose}
      />
    </>
  );
}

export default AppMenu;