/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { User } from '@supabase/supabase-js';
import supabaseClient from '@utils/supabaseClient';

interface AuthProps {
  initialUser: User
}

function signOut() {
  return supabaseClient.auth.signOut();
}

function hasUser() {
  return supabaseClient.auth.getUser() != null;
}

function getUser() {
  return supabaseClient.auth.getUser();
}

function signInWithGoogle() {
  return supabaseClient.auth.signInWithOAuth(
    {
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    },
  );
}

function signInWithAzure() {
  return supabaseClient.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email',
      redirectTo: window.location.origin,
    },
  });
}

const authService = {
  signOut,
  hasUser,
  getUser,
  signInWithGoogle,
  signInWithAzure,
};

export default authService;

export type { AuthProps };
