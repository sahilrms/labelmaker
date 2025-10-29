import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requiredRole }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`);
    } else if (status === 'authenticated' && requiredRole && session?.user?.role !== requiredRole) {
      // Redirect to unauthorized or dashboard if user doesn't have the required role
      router.push('/unauthorized');
    }
  }, [status, router, session, requiredRole]);

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (requiredRole && session?.user?.role !== requiredRole) {
    return null; // Or a custom unauthorized component
  }

  return <>{children}</>;
}
