import getConfig from 'next/config';
import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import ClientDialog from '../client/components/ClientDialog';
import { LayoutContext } from './context/layoutcontext';

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const [clientDialog, setClientDialog] = useState(false);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const openClientDialog = () => {
        setClientDialog(true);
    };

    const closeClientDialog = (item) => {
        console.log(item);
        setClientDialog(false);
    }

    return (
        <React.Fragment>
            <div className="layout-topbar">
                <Link legacyBehavior href="/">
                    <a className="layout-topbar-logo">
                        <>
                            <img src={`${contextPath}/images/Seattle_Humane_Logo.png`} alt="logo" />
                            <span>Seattle Humane</span>
                        </>
                    </a>
                </Link>

                <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                    <i className="pi pi-bars" />
                </button>

                <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                    <i className="pi pi-ellipsis-v" />
                </button>

                <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                    <button type="button" className="p-link layout-topbar-button" onClick={openClientDialog}>
                        <i className="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" className="p-link layout-topbar-button">
                        <i className="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>

            <ClientDialog
                visible={clientDialog}
                onClose={closeClientDialog} />
        </React.Fragment>
    );
});

export default AppTopbar;
