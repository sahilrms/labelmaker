import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function SignOutButton({ className = '' }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const data = await signOut({ 
      redirect: false,
      callbackUrl: '/auth/signin'
    });
    
    // Force a full page reload to clear all client-side state
    window.location.href = data.url;
  };

  return (
    <button
      onClick={handleSignOut}
      className={`${className} inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
    >
      Sign out
    </button>
  );
}
