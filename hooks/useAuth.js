import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userService } from '../user/service/UserService';

function useAuth() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    userService.getSession().then(session => {
      if (session.authenticated === false) {
        router.push('/login');
      } else {
        setAuthenticated(true);
        setRole(session.role);
      }
      setLoading(false);
      // throw in catch
    });
  }, [router]);

  return { loading, authenticated, role };
}

export default useAuth;