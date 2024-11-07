// src/contexts/UserContext.js

import React, { createContext, useContext } from 'react';
import { useUser } from '@clerk/clerk-react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user } = useUser();
  const userId = user?.id;

  return (
    <UserContext.Provider value={userId}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserId() {
  return useContext(UserContext);
}
