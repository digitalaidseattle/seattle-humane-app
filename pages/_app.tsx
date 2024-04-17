import React, { useEffect, useMemo, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import { UserContext } from '../src/context/usercontext';
import authService from '../src/services/authService';

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>();
  const userContext = useMemo(() => ({
    user, setUser,
  }), [user]);

  useEffect(() => {
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
