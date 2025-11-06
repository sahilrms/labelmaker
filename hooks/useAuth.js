// hooks/useAuth.js
'use client';

import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

export function useAuth(required = true) {
  const { data: session, status, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      if (status === 'authenticated') {
        // Try to get token from session
        const token = session?.accessToken || 
                     session?.user?.accessToken || 
                     session?.token?.accessToken;
        
        if (token) {
          setAccessToken(token);
          setIsLoading(false);
          return;
        }

        // If no token, try to refresh session
        try {
          const response = await fetch('/api/auth/session', {
            credentials: 'include',
          });
          const newSession = await response.json();
          
          if (newSession?.accessToken) {
            await update();
            setAccessToken(newSession.accessToken);
          } else {
            throw new Error('No access token in session');
          }
        } catch (error) {
          console.error('Failed to refresh session:', error);
          if (required) {
            await signIn();
          }
        }
      } else if (status === 'unauthenticated' && required) {
        await signIn();
      }
      setIsLoading(false);
    };

    getToken();
  }, [session, status, update, required]);

  return {
    session,
    status,
    accessToken,
    isLoading: status === 'loading' || isLoading,
    isAuthenticated: status === 'authenticated',
    signIn,
  };
}