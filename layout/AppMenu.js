import getConfig from 'next/config';
import React, { useContext, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import ServiceRequestDialog from '@components/serviceRequest/ServiceRequestDialog';
// import pawIcon from '/images/paw.svg';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [dialog, showDialog] = useState('')
    const onClose = () => showDialog('')
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const model = [
        {
            label: 'Home',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
                { label: 'Clients', icon: 'pi pi-fw pi-users', to: '/clients' },
                { label: 'Animals', iconSrc: `${contextPath}/images/paw.svg`, to: '/animals' },
                { label: 'Reports', icon: 'pi pi-fw pi-book', to: '/reports' },
                { separator: true },
                { 
                  label: 'New Request', 
                  iconSrc: `${contextPath}/images/pawClipboard.svg`, 
                  key: 'newServiceRequest', 
                  command: () => {if (!dialog) showDialog('newServiceRequest')} 
                }
            ]
        }
    ];

    return (
      <>
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.separator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
        <ServiceRequestDialog 
          visible={dialog === 'newServiceRequest'}
          onClose={onClose}
        />
      </>
    );
};

export default AppMenu;
