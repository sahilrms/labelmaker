// // components/Layout.js
// import { signOut, useSession } from 'next-auth/react';
// import Link from 'next/link';

// export default function Layout({ children }) {
//   const { data: session } = useSession();

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="bg-gray-800 text-white w-64 flex flex-col">
//         <div className="p-4 border-b border-gray-700">
//           <h1 className="text-xl font-bold">Label Maker</h1>
//         </div>
        
//         {/* Navigation Links */}
//         <nav className="flex-1 p-4 space-y-2">
//           <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
//             Dashboard
//           </Link>
//           <Link href="/label-maker" className="block py-2 px-4 rounded hover:bg-gray-700">
//             Print Labels
//           </Link>
//           <Link href="/print-history" className="block py-2 px-4 rounded hover:bg-gray-700">
//             Print History
//           </Link>
//           <div className="pt-4">
//             <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sales</h3>
//             <div className="mt-2 space-y-1">
//               <Link href="/counters" className="block py-2 px-4 rounded hover:bg-gray-700">
//                 Counters
//               </Link>
//               <Link href="/products" className="block py-2 px-4 rounded hover:bg-gray-700">
//                 Products
//               </Link>
//             </div>
//           </div>

//           {/* Settings - Only visible to admin */}
//           {session?.user?.role === 'admin' && (
//             <div className="pt-4">
//               <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Administration</h3>
//               <div className="mt-2 space-y-1">
//                 <Link href="/settings" className="block py-2 px-4 rounded hover:bg-gray-700">
//                   Settings
//                 </Link>
//               </div>
//             </div>
//           )}
//         </nav>

//         {/* User Info and Logout */}
//         {session && (
//           <div className="p-4 border-t border-gray-700">
//             <div className="flex items-center justify-between">
//               <div>
//                 {JSON.stringify(session)}
//                 <p className="text-sm font-medium">{session?.user?.email}</p>
//                 <p className="text-xs text-gray-400">{session?.user?.role}</p>
//               </div>
//               <button
//                 onClick={() => signOut({ callbackUrl: '/auth/signin' })}
//                 className="text-sm text-gray-300 hover:text-white"
//               >
//                 Sign out
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-y-auto p-6">
//         {children}
//       </div>
//     </div>
//   );
// }

// components/Layout.js
'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Layout({ children }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
useEffect(() => {
  if (session?.user) {
    setUser(session.user);
  }
}, [session]);

if (status === 'loading') {
  return <div>Loading...</div>;
}

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-gray-800 text-white w-64 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Label Maker</h1>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link href="/label-maker" className="block py-2 px-4 rounded hover:bg-gray-700">
            Print Labels
          </Link>
          <Link href="/print-history" className="block py-2 px-4 rounded hover:bg-gray-700">
            Print History
          </Link>
          
          {/* Sales Section */}
          <div className="pt-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sales</h3>
            <div className="mt-2 space-y-1">
              <Link href="/counters" className="block py-2 px-4 rounded hover:bg-gray-700">
                Counters
              </Link>
              <Link href="/products" className="block py-2 px-4 rounded hover:bg-gray-700">
                Products
              </Link>
            </div>
          </div>

          {/* Admin Section - Only visible to admin */}
          {true && (
            <div className="pt-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Administration</h3>
              <div className="mt-2 space-y-1">
                <Link href="/settings" className="block py-2 px-4 rounded hover:bg-gray-700">
                  Settings
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* User Info and Logout */}
        {JSON.stringify(session)}
        {true  && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user?.email || 'User'}</p>
                {user?.role && (
                  <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                )}
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