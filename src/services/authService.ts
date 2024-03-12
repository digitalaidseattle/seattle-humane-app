/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import supabaseClient from '../../utils/supabaseClient'
import { User } from '@supabase/supabase-js'

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
    return supabaseClient.auth.getUser()
}

function signInWithGoogle() {
  return supabaseClient.auth.signInWithOAuth({ provider: 'google' })
}

function signInWithAzure() {
  return supabaseClient.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email',
    },
  })
}

export const authService = {
  signOut,
  hasUser,
  getUser,
  signInWithGoogle,
  signInWithAzure
}

export type { AuthProps }
