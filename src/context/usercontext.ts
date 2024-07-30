/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 *  usercontext.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { User } from '@supabase/supabase-js';
import React, { useContext } from 'react';

// FIXME change type from supabase to SH Employee
export const UserContext = React.createContext({
  user: null as unknown as User,
  setUser: (u: User) => { },
});

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
