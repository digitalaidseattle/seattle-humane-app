import React, { useEffect, useMemo, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { usePathname, useRouter } from 'next/navigation';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutProvider } from '@layout/context/layoutcontext';
import Layout from '@layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@styles/layout/layout.scss';
import 'styles/global.css';
import { UserContext } from '@context/usercontext';
import authService from '@services/authService';
import { EXTERNAL_ROUTES } from 'src/constants';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>();
  const userContext = useMemo(() => ({
    user, setUser,
  }), [user]);

  useEffect(() => {
    if (EXTERNAL_ROUTES.includes(pathname)) {
      return;
    }
    authService.getUser()
      .then((resp: any) => {
        if (resp.data.user) {
          setUser(resp.data.user);
        } else {
          router.push('/auth/login');
        }
      });
  }, [router]);

  if (Component.getLayout) {
    return (
      <LayoutProvider>
        <UserContext.Provider value={userContext}>
          {
            // eslint-disable-next-line react/jsx-props-no-spreading
            Component.getLayout(<Component {...pageProps} />)
          }
        </UserContext.Provider>
      </LayoutProvider>
    );
  }
  return (
    <LayoutProvider>
      <UserContext.Provider value={userContext}>
        {
        !user
        && EXTERNAL_ROUTES.some((route) => route === pathname)
        // eslint-disable-next-line react/jsx-props-no-spreading
        && <Component {...pageProps} />
         }
        {user && (
          <Layout>
            {
              // eslint-disable-next-line react/jsx-props-no-spreading
              <Component {...pageProps} />
            }
          </Layout>
        )}
      </UserContext.Provider>
    </LayoutProvider>
  );
}
