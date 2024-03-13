import React, { useEffect, useState } from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import { UserContext } from '../src/context/usercontext';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import authService from '../src/services/authService';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>();

    useEffect(() => {
        authService.getUser()
            .then((resp: any) => {
                if (resp.data.user) {
                    setUser(resp.data.user)
                } else {
                    router.push('/auth/login')
                }
            })
    }, [router])

    if (Component.getLayout) {
        return (
            <LayoutProvider>
                <UserContext.Provider value={{ user, setUser }}>
                    {Component.getLayout(<Component {...pageProps} />)}
                </UserContext.Provider>
            </LayoutProvider>
        );
    } else {
        return (
            <LayoutProvider>
                <UserContext.Provider value={{ user, setUser }}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </UserContext.Provider>
            </LayoutProvider>
        );
    }
}
