import getConfig from 'next/config';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import ClientDialog from '@components/ClientDialog';
import { UserContext } from '@context/usercontext';
import { LayoutContext } from './context/layoutcontext';
import AppMenu from './AppMenu';

const AppTopbar = forwardRef((_props, ref) => {
  const { layoutState, showProfileSidebar } = useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const { contextPath } = getConfig().publicRuntimeConfig;

  const [clientDialog, setClientDialog] = useState(false);
  useContext(UserContext);

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));
  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current,
  }));

  const closeClientDialog = (item: any) => {
    console.log(item);
    setClientDialog(false);
  };

  return (
    <>
      <div className="layout-topbar sh-logo">
        <Link href="/" className="sh-logo">
          <div className="flex">
            <Image
              src={`${contextPath}/images/shs-favicon.png`}
              width="38"
              height="33"
              alt="logo"
            />
            <div>
              <div className="text-cyan-700 font-semibold">Seattle</div>
              <div
                className="text-cyan-700 font-semibold"
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: 'red',
                }}
              >
                Humane
              </div>
            </div>
          </div>
        </Link>

        <button
          ref={topbarmenubuttonRef}
          type="button"
          className="p-link layout-topbar-menu-button layout-topbar-button"
          onClick={showProfileSidebar}
          aria-label="Open profile sidebar"
        >
          <i className="pi pi-ellipsis-v" />
        </button>

        <div
          ref={topbarmenuRef}
          className={classNames('layout-topbar-menu', {
            'layout-topbar-menu-mobile-active':
              layoutState.profileSidebarVisible,
          })}
        >
          <AppMenu />
        </div>
      </div>

      <ClientDialog visible={clientDialog} onClose={closeClientDialog} />
    </>
  );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;
