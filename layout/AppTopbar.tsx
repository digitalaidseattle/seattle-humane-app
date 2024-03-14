import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { classNames } from 'primereact/utils';
import React, {
  forwardRef, useContext, useImperativeHandle, useRef, useState,
} from 'react';
import ClientDialog from '../src/components/ClientDialog';
import authService from '../src/services/authService';
import { LayoutContext } from './context/layoutcontext';
import { UserContext } from '../src/context/usercontext';

const AppTopbar = forwardRef((props, ref) => {
  const {
    layoutState, onMenuToggle, showProfileSidebar,
  } = useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const { contextPath } = getConfig().publicRuntimeConfig;

  const [clientDialog, setClientDialog] = useState(false);
  const { user } = useContext(UserContext);
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  const openClientDialog = () => {
    setClientDialog(true);
  };

  const closeClientDialog = (item) => {
    console.log(item);
    setClientDialog(false);
  };

  const signOut = () => {
    AuthService.signOut().then(() => {
      router.push('/auth/login');
    });
  };

  return (
    <>
      <div className="layout-topbar">
        <Link legacyBehavior href="/">
          <div className="layout-topbar-logo">
            <img src={`${contextPath}/images/shs-favicon.png`} alt="logo" />
            <span>Seattle Humane</span>
          </div>
        </Link>

        <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
          <i className="pi pi-bars" />
        </button>

        <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
          <i className="pi pi-ellipsis-v" />
        </button>

        <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
          <button type="button" className="p-link layout-topbar-button" onClick={openClientDialog}>
            <i className="pi pi-ticket" />
            <span>Ticket</span>
          </button>
          <button type="button" title={user ? user.email : 'user'} className="p-link layout-topbar-button" onClick={signOut}>
            <i className="pi pi-user" />
            <span>profile</span>
          </button>
        </div>
      </div>

      <ClientDialog
        visible={clientDialog}
        onClose={closeClientDialog}
      />
    </>
  );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
