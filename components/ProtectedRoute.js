// components/ProtectedRoute.js
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './ui/LoadingSpinner';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isLoading, session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin');
    }
    
    if (!isLoading && isAuthenticated && adminOnly && !session?.user?.isAdmin) {
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, router, session, adminOnly]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (adminOnly && !session?.user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
          <p className="mt-2">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
}