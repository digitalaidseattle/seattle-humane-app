/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { User } from '@supabase/supabase-js';
import supabaseClient from '../../utils/supabaseClient';

interface AuthProps {
  initialUser: User
}
class AuthService {
  static async signOut() {
    return supabaseClient.auth.signOut();
  }

  static hasUser() {
    return supabaseClient.auth.getUser() != null;
  }

  static getUser = (async () => supabaseClient.auth.getUser());

  static signInWithGoogle = async () => supabaseClient.auth.signInWithOAuth({ provider: 'google' })
    .then((resp) => resp);

  static signInWithAzure = async () => supabaseClient.auth.signInWithOAuth({ provider: 'azure' })
    .then((resp) => resp);
}

export { AuthService };
export type { AuthProps };
