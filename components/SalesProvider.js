// components/SessionProvider.js
'use client';

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({ children }) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Re-fetch session every 5 minutes
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
}