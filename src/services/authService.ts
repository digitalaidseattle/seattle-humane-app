/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { GetServerSideProps } from 'next';
import { User } from '@supabase/supabase-js';
import supabaseClient from '../../utils/supabaseClient';

interface AuthProps {
  initialUser: User
}
class AuthService {
  async signOut() {
    return supabaseClient.auth.signOut();
  }

  hasUser() {
    return supabaseClient.auth.getUser() != null;
  }

  getUser = (async () => supabaseClient.auth.getUser());

  signInWithGoogle = async () => supabaseClient.auth.signInWithOAuth({ provider: 'google' })
    .then((resp) => resp);

  signInWithAzure = async () => supabaseClient.auth.signInWithOAuth({ provider: 'azure' })
    .then((resp) => resp);
}

const authService = new AuthService();
export { authService, AuthService };
export type { AuthProps };
