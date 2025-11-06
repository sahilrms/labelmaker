import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      setUser(session.user);
      setLoading(false);
    } else if (status === 'unauthenticated') {
      setUser(null);
      setLoading(false);
    }
  }, [session, status]);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
