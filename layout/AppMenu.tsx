import getConfig from 'next/config';
import React, {
  useContext, useState,
} from 'react';
import ServiceRequestDialog from '@components/serviceRequest/ServiceRequestDialog';
import { useRouter } from 'next/router';
import { usePathname, useSearchParams } from 'next/navigation';
import { UserContext } from '@context/usercontext';
import authService from '@services/authService';
import AppMenuitem from '@layout/AppMenuitem';
import { MenuProvider } from '@layout/context/menucontext';

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
  const [dialogVisible, setDialogVisible] = useState(false);
  const { user } = useContext(UserContext);
  const { contextPath } = getConfig().publicRuntimeConfig;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const ticketId = searchParams.get('ticket');
  const onClose = () => {
    setDialogVisible(false);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete('ticket');
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  const models: { items: (Item)[] }[] = [{
    items: [

      { label: 'Dashboard', icon: 'pi pi-fw pi-chart-line', to: '/' },
      {
        label: 'New Request',
        iconSrc: `${contextPath}/images/pawClipboard.svg`,
        key: 'newServiceRequest',
        class: 'new-request-icon',
        command: () => {
          if (!dialogVisible) setDialogVisible(true);
        },
      },
      {
        label: 'Logout',
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
        ticketId={ticketId}
        visible={dialogVisible || !!ticketId}
        onClose={onClose}
      />
    </>
  );
}

export default AppMenu;
