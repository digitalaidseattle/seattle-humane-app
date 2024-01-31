import getConfig from "next/config";
import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
// import pawIcon from '/images/paw.svg';

const AppMenu = () => {
  const { layoutConfig, role } = useContext(LayoutContext);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const model = [
    {
      label: "Home",
      items: [
        { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" },
        { label: "Clients", icon: "pi pi-fw pi-users", to: "/clients" },
        {
          label: "Animals",
          iconSrc: `${contextPath}/images/paw.svg`,
          to: "/animals",
        },
        role === "admin"
          ? { label: "Reports", icon: "pi pi-fw pi-book", to: "/reports" }
          : {},
      ],
    },
  ];

  return (
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
  );
};

export default AppMenu;
