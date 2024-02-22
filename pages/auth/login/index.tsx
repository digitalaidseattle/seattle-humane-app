import getConfig from "next/config";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import AppConfig from "../../../layout/AppConfig";
import { Button } from "primereact/button";
import { LayoutContext } from "../../../layout/context/layoutcontext";
import { classNames } from "primereact/utils";
import { authService } from "../../../src/services/authService";
import { GetServerSideProps } from "next";
import supabaseClient from "../../../utils/supabaseClient";
import GoogleIcon from "../../../src/components/GoogleIcon";


const LoginPage = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const router = useRouter();
  const containerClassName = classNames(
    "surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden",
    { "p-input-filled": layoutConfig.inputStyle === "filled" }
  );

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      supabaseClient.auth.getUser().then((userResponse) => {
        const loggedInUser = userResponse.data.user;
        if (loggedInUser) {
          router.push("/");
        }
      });
    });
  }, [router]);

  const signInWithGoogle = async () => {
    authService.signInWithGoogle();
  };

  const signInWithAzure = async () => {
    authService.signInWithAzure();
  };

  return (
    <div className={containerClassName}>
      <div className="flex flex-column align-items-center justify-content-center">
        <div
          style={{
            borderRadius: "56px",
          }}
        >
          <div
            className="w-full surface-card pb-7 px-5 sm:px-8"
            style={{ borderRadius: "53px" }}
          >
            <div className="text-center mb-5">
              <img
                src={`${contextPath}/images/Seattle_Humane_Logo.png`}
                alt="Image"
                height="200"
                className=""
              />
              <div className="">
                <div
                  className="text-teal-700 font-medium "
                  style={{ position: "relative", zIndex: "10", bottom: "3rem" }}
                >
                  Pet Assistance and Welfare System
                </div>
              </div>
            </div>
            <div
              className="flex"
              style={{ position: "relative", zIndex: "11", bottom: "2rem" }}
            >
              <Button
                icon={
                  <img
                    src={`${contextPath}/images/MicrosoftIcon.svg`}
                    alt="Image"
                    height="30"
                    className="mr-2"
                  />
                }
                label="Sign in with Microsoft"
                className="w-full text-sm bg-white border-gray-900 text-gray-900 mr-2 pl-3 pr-5"
                onClick={signInWithAzure}
                style={{ whiteSpace: "nowrap" }}
              ></Button>

              <Button
                label="Sign in with Google"
                icon={<GoogleIcon />}
                className="w-full text-sm ml-3 bg-white border-gray-900 text-gray-900"
                onClick={signInWithGoogle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

LoginPage.getLayout = function getLayout(page) {
  return (
    <React.Fragment>
      {page}
      <AppConfig simple />
    </React.Fragment>
  );
};

export default LoginPage;
