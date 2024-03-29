/**
 *  authService.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { GetServerSideProps } from 'next'
import supabaseClient from '../../utils/supabaseClient'
import { User } from '@supabase/supabase-js'

interface AuthProps {
  initialUser: User
}
class AuthService {

  async signOut() {
    return supabaseClient.auth.signOut()
  }

  hasUser() {
    return supabaseClient.auth.getUser() != null
  }

  getUser = (async () => {
    return supabaseClient.auth.getUser()
  })


  signInWithGoogle = async () => {
    return supabaseClient.auth.signInWithOAuth({ provider: 'google' })
      .then(resp => {
        return resp
      })
  }
  
  signInWithAzure = async () => {
    return supabaseClient.auth.signInWithOAuth({ provider: 'azure' })
      .then(resp => {
        return resp
      })
  }
}


const authService = new AuthService()
export { authService, AuthService }
export type { AuthProps }
