import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../user/service/UserService';

function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getSession().then(session => {
      if (!session) {
        router.push('/login');
      } else {
        setAuthenticated(true);
        setRole(session.role);
      }
      setLoading(false);
    });
  }, [router]);

  return { loading, authenticated, role };
}

export default useAuth;