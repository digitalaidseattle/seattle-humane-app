/**
 *  usercontext.ts
 *
 *  @copyright 2024 Digital Aid Seattle
 *
 */
import { User } from '@supabase/supabase-js';
import React from 'react';

// FIXME change type from supabase to SH Employee
export const UserContext = React.createContext({
  user: null as unknown as User,
  setUser: (u: User) => { },
});
