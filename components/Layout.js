// components/Layout.js
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Layout({ children }) {
  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Label Maker</h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/label-maker" className="block py-2 px-4 rounded hover:bg-gray-700">
            Print Labels
          </Link>
          <Link href="/print-history" className="block py-2 px-4 rounded hover:bg-gray-700">
            Print History
          </Link>
          {/* Add more navigation links as needed */}
        </nav>

        {/* User Info and Logout */}
        {session && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{session.user.email}</p>
                <p className="text-xs text-gray-400">{session.user.role}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="text-sm text-gray-300 hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {children}
      </div>
    </div>
  );
}