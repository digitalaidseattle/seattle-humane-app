import getConfig from "next/config";
import React, { useContext, useState, useEffect, useCallback } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import ServiceRequestDialog from "@components/serviceRequest/ServiceRequestDialog";
import { UserContext } from '../src/context/usercontext';
import { User } from '@supabase/supabase-js'
import { authService } from '../src/services/authService';
import { useRouter } from 'next/navigation';



// import pawIcon from '/images/paw.svg';

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const [dialog, showDialog] = useState("");
  const onClose = () => showDialog("");
  const { user } = useContext(UserContext);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const router = useRouter();
  const model = [
    {
      items: [
        { label: "Dashboard", icon: "pi pi-fw pi-chart-line", to: "/" },
        { separator: true },
        { label: "Clients", icon: "pi pi-fw pi-users", to: "/clients"},
        { separator: true },
        {
          label: "Animals",
          iconSrc:`${contextPath}/images/paw.svg`,
          to: "/animals",
          class: `animals-icon`,
        },
        { separator: true },
        { label: "Reports", icon: "pi pi-fw pi-book", to: "/reports" },
        { separator: true },
        {
          label: "New Request",
          iconSrc:`${contextPath}/images/pawClipboard.svg`,
          key: "newServiceRequest",
          class:`new-request-icon`,
          command: () => {
            if (!dialog) showDialog("newServiceRequest");
          },
        },
        { separator: true },
        {
          label: "Profile",
          icon: "pi pi-user",
          to: "/auth/login",
          title: user?.email || "user",
          command: () => {
            signOut()
          },
        },
      ],
    },
  ];

     const signOut = (item) => {
        authService.signOut().then(() => {
            router.push("/auth/login")
        })
     };
  

  return (
    <>
      <MenuProvider>
        <ul className="layout-menu">
          {model.map((item, i) => {
            return !item.separator ? (
              <AppMenuitem item={item} root={true} index={i} key={item.label} />
            ) : (
              <li className="menu-separator"></li>
            );
          })}
        </ul>
      </MenuProvider>
      <ServiceRequestDialog
        visible={dialog === "newServiceRequest"}
        onClose={onClose}
      />
    </>
  );
};

export default AppMenu;
