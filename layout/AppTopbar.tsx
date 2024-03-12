import getConfig from "next/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { classNames } from "primereact/utils";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ClientDialog from "../src/components/ClientDialog";
import { LayoutContext } from "./context/layoutcontext";
import { UserContext } from "../src/context/usercontext";
import AppMenu from "./AppMenu";

// eslint-disable-next-line react/display-name
const AppTopbar = forwardRef((_props, ref) => {
  const { layoutState, showProfileSidebar } = useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;

  const [clientDialog, setClientDialog] = useState(false);
  useContext(UserContext);

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
    <React.Fragment>
      <div className="layout-topbar">
        <Link legacyBehavior href="/">
          <a className="layout-topbar-log">
            <div className="flex">
              <img src={`${contextPath}/images/shs-favicon.png`} alt="logo" />
              <div>
                <div className="text-cyan-700 font-semibold">Seattle</div>
                <div
                  className="text-cyan-700 font-semibold"
                  style={{
                    textDecoration: "underline",
                    textDecorationColor: "red",
                  }}
                >
                  Humane
                </div>
              </div>
            </div>
          </a>
        </Link>

        <button
          ref={topbarmenubuttonRef}
          type="button"
          className="p-link layout-topbar-menu-button layout-topbar-button"
          onClick={showProfileSidebar}
        >
          <i className="pi pi-ellipsis-v" />
        </button>

        <div
          ref={topbarmenuRef}
          className={classNames("layout-topbar-menu", {
            "layout-topbar-menu-mobile-active":
              layoutState.profileSidebarVisible,
          })}
        >
          <AppMenu />
        </div>
      </div>

      <ClientDialog visible={clientDialog} onClose={closeClientDialog} />
    </React.Fragment>
  );
});

export default AppTopbar;
