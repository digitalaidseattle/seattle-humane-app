import React, { useMemo, useState } from 'react';

export const LayoutContext = React.createContext(null);

export function LayoutProvider({ children }) {
  const [layoutConfig, setLayoutConfig] = useState({
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
    scale: 14,
  });

  const [layoutState, setLayoutState] = useState({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  });

  const isOverlay = () => layoutConfig.menuMode === 'overlay';

  const isDesktop = () => window.innerWidth > 991;

  const onMenuToggle = () => {
    if (isOverlay()) {
      setLayoutState((prevLayoutState) => (
        { ...prevLayoutState, overlayMenuActive: !prevLayoutState.overlayMenuActive }
      ));
    }

    if (isDesktop()) {
      setLayoutState((prevLayoutState) => (
        {
          ...prevLayoutState,
          staticMenuDesktopInactive: !prevLayoutState.staticMenuDesktopInactive,
        }
      ));
    } else {
      setLayoutState((prevLayoutState) => (
        { ...prevLayoutState, staticMenuMobileActive: !prevLayoutState.staticMenuMobileActive }
      ));
    }
  };

  const showProfileSidebar = () => {
    setLayoutState((prevLayoutState) => (
      { ...prevLayoutState, profileSidebarVisible: !prevLayoutState.profileSidebarVisible }));
  };

  const value = useMemo(() => ({
    layoutConfig,
    setLayoutConfig,
    layoutState,
    setLayoutState,
    onMenuToggle,
    showProfileSidebar,
  }), []);

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>;
}
