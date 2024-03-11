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

export function signOut() {
  return supabaseClient.auth.signOut()
}


// class AuthService {

//   async signOut() {
//     return supabaseClient.auth.signOut()
//   }

//   hasUser() {
//     return supabaseClient.auth.getUser() != null
//   }

//   getUser = (async () => {
//     return supabaseClient.auth.getUser()
//   })

//   signInWithGoogle = () => {
//     supabaseClient.auth.signInWithOAuth({ provider: 'google' })
//   }
  
//   signInWithAzure = async () => {
//     return supabaseClient.auth.signInWithOAuth({
//       provider: 'azure',
//       options: {
//         scopes: 'email',
//       },
//     })
//     .then(resp => {
//       return resp
//     })
//   }
// }


export { authService, AuthService }
export type { AuthProps }
