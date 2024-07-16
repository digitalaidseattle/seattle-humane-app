import getConfig from 'next/config';
import React, { useContext } from 'react';
import { LayoutContext } from '@layout/context/layoutcontext';

function AppFooter() {
  const { layoutConfig } = useContext(LayoutContext);
  const { contextPath } = getConfig().publicRuntimeConfig;

  return (
    <div className="layout-footer">
      Powered by
      <img src={`${contextPath}/images/digital-aid-seattle-${layoutConfig.colorScheme === 'light' ? 'light' : 'dark'}-icon.svg`} alt="Digital Aid Seattle logo" height="20" className="mr-2" />
      <span className="font-medium ml-2">Digital Aid Seattle</span>
    </div>
  );
}

export default AppFooter;
