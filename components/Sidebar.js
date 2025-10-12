import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeIcon,
  TagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CubeIcon,
  Cog6ToothIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, current: router.pathname === '/' },
    { name: 'Label Maker', href: '/label-maker', icon: TagIcon, current: router.pathname === '/label-maker' },
    { name: 'Products', href: '#', icon: CubeIcon, current: false },
    { name: 'Settings', href: '#', icon: Cog6ToothIcon, current: false },
  ];

  return (
    <div
      className={`
        ${isOpen ? 'w-64' : 'w-20'}
        h-screen flex flex-col justify-between
        bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950
        text-white shadow-2xl border-r border-indigo-600/20
        backdrop-blur-md bg-opacity-70
        transition-all duration-300 ease-in-out
      `}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between px-4 h-20 border-b border-indigo-600/20">
        {isOpen ? (
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
              <TagIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent tracking-tight">
              Label<span className="text-indigo-300">Pro</span>
            </span>
          </div>
        ) : (
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md mx-auto">
            <TagIcon className="h-5 w-5 text-white" />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`
            p-2 rounded-lg text-indigo-200 hover:text-white
            hover:bg-indigo-600/40 focus:outline-none
            transition-all duration-200
          `}
        >
          {isOpen ? (
            <ChevronLeftIcon className="h-5 w-5" />
          ) : (
            <ChevronRightIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 overflow-y-auto custom-scrollbar space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              group flex items-center rounded-xl mx-2 px-4 py-3 text-sm font-medium transition-all duration-200
              border border-transparent
              ${
                item.current
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md scale-[1.02]'
                  : 'text-indigo-200 hover:bg-indigo-700/50 hover:text-white hover:scale-[1.02]'
              }
            `}
          >
            <span
              className={`
                p-2 rounded-lg flex items-center justify-center transition-all duration-200
                ${
                  item.current
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'bg-indigo-600/40 text-indigo-300 group-hover:bg-indigo-500/70 group-hover:text-white'
                }
              `}
            >
              <item.icon className="h-5 w-5" />
            </span>
            {isOpen && (
              <span className="ml-3 tracking-wide">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div
        className={`
          p-4 border-t border-indigo-600/20
          bg-gradient-to-tr from-indigo-800/80 to-indigo-700/70
          flex items-center ${isOpen ? 'justify-start' : 'justify-center'}
          shadow-inner
        `}
      >
        <div
          className={`
            ${isOpen ? 'h-10 w-10' : 'h-9 w-9'}
            rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600
            flex items-center justify-center shadow-md
          `}
        >
          <UserCircleIcon className="h-6 w-6 text-white" />
        </div>
        {isOpen && (
          <div className="ml-3">
            <p className="text-sm font-semibold text-white">Admin User</p>
            <p className="text-xs text-indigo-300/80">admin@labelpro.com</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
