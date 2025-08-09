'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LogOut, 
  User, 
  Home, 
  FileText, 
  Users, 
  Activity,
  Settings,
  PlusCircle,
  Menu,
  X,
  ChevronRight,
  Globe,
  Layers,
  LayoutDashboard
} from 'lucide-react';
import { hasRole } from '@/utils/helpers';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!user) {
    return null;
  }

  const isActive = (path: string) => pathname === path;

  const navItems: {
    path: string;
    label: string;
    icon: React.ReactNode;
    roles: ('admin' | 'editor' | 'viewer')[];
    badge?: {
      count: number;
      color: string;
    };
  }[] = [
    { 
      path: '/dashboard', 
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      roles: ['admin', 'editor', 'viewer'] 
    },
    { 
      path: '/dashboard/posts', 
      label: 'News Feed',
      icon: <Globe size={20} />,
      roles: ['admin', 'editor', 'viewer'] 
    },
    {
      path: '/dashboard/create-post',
      label: 'Create Post',
      icon: <PlusCircle size={20} />,
      roles: ['admin', 'editor']
    },
    { 
      path: '/dashboard/editor-posts', 
      label: 'My Posts',
      icon: <Layers size={20} />,
      roles: ['editor', 'admin'] 
    },
    { 
      path: '/dashboard/users', 
      label: 'Users',
      icon: <Users size={20} />,
      roles: ['admin'] 
    },
    { 
      path: '/dashboard/logs', 
      label: 'System Logs',
      icon: <Activity size={20} />,
      roles: ['admin'] 
    },
    { 
      path: '/dashboard/profile', 
      label: 'Profile',
      icon: <User size={20} />,
      roles: ['admin', 'editor', 'viewer'] 
    },
    {
      path: '/dashboard/settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      roles: ['admin', 'editor', 'viewer']
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const mobileMenuClasses = isMobileMenuOpen
    ? "fixed inset-0 z-50 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col animate-fade-in"
    : "hidden";

  // Role-based color schemes
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-indigo-600 to-purple-600';
      case 'editor': return 'from-blue-600 to-cyan-600';
      case 'viewer': return 'from-emerald-600 to-teal-600';
      default: return 'from-blue-600 to-purple-600';
    }
  };

  const roleColor = getRoleColor(user.role);

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-full bg-white shadow-lg text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${mobileMenuClasses} lg:hidden`}>
        <div className="p-6 flex justify-between items-center border-b border-slate-700/50">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${roleColor} flex items-center justify-center text-white font-bold shadow-lg`}>
              {user?.firstName?.charAt(0).toUpperCase() || ''}
            </div>
            <div className="ml-3">
              <p className="font-medium text-white">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-300 capitalize">{user.role}</p>
            </div>
          </div>
          <button onClick={toggleMobileMenu} className="p-2 rounded-full hover:bg-slate-700/50 transition-colors">
            <X size={24} className="text-white" />
          </button>
        </div>
        
        <nav className="flex-grow p-6 overflow-y-auto">
          <ul className="space-y-3">
            {navItems.map((item) => {
              if (hasRole(user, item.roles)) {
                return (
                  <li key={item.path} className="animate-fade-in" style={{animationDelay: '0.1s'}}>
                    <Link
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center p-3 rounded-xl transition-all ${
                        isActive(item.path) 
                          ? `bg-gradient-to-r ${roleColor} text-white shadow-md` 
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className={`ml-auto ${item.badge.color} text-white text-xs font-medium px-2 py-1 rounded-full`}>
                          {item.badge.count}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              }
              return null;
            })}
            
            <li className="pt-6 mt-6 border-t border-slate-700/50 animate-fade-in" style={{animationDelay: '0.2s'}}>
              <button
                onClick={logout}
                className="flex items-center p-3 w-full text-left rounded-xl text-white hover:bg-white/10 transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex bg-white dark:bg-slate-900 text-gray-900 dark:text-white ${collapsed ? 'w-20' : 'w-72'} min-h-screen flex-col border-r border-gray-200 dark:border-slate-800 shadow-sm transition-all duration-300 ease-in-out`}>
        <div className={`p-5 border-b border-gray-100 dark:border-slate-800 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
          {!collapsed && <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Social Dashboard</h2>}
          {collapsed && <LayoutDashboard size={26} className="text-blue-600" />}
          
          <button 
            onClick={() => setCollapsed(!collapsed)} 
            className={`${collapsed ? 'hidden' : 'flex'} p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400`}
          >
            <ChevronRight size={18} className={`transition-transform ${collapsed ? 'rotate-0' : 'rotate-180'}`} />
          </button>
        </div>

        <div className={`p-5 border-b border-gray-100 dark:border-slate-800 ${collapsed ? 'flex justify-center' : ''}`}>
          <div className={`${collapsed ? '' : 'flex items-center'}`}>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${roleColor} flex items-center justify-center text-white font-bold shadow-md`}>
              {user.firstName?.charAt(0).toUpperCase() || ''}
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="font-medium">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
            )}
          </div>
        </div>

        <nav className={`flex-grow ${collapsed ? 'px-2 py-5' : 'p-5'} overflow-y-auto`}>
          <ul className="space-y-1">
            {navItems.map((item, index) => {
              if (hasRole(user, item.roles)) {
                return (
                  <li key={item.path} className={mounted ? 'animate-fade-in' : ''} style={{animationDelay: `${index * 0.05}s`}}>
                    <Link
                      href={item.path}
                      className={`flex items-center ${collapsed ? 'justify-center p-3' : 'p-3'} rounded-xl transition-all duration-200 group relative ${
                        isActive(item.path) 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className={`${isActive(item.path) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'} transition-colors ${collapsed ? '' : 'mr-3'}`}>
                        {item.icon}
                      </span>
                      
                      {!collapsed && (
                        <>
                          {item.label}
                          {item.badge && (
                            <span className={`ml-auto ${item.badge.color} text-white text-xs px-2 py-0.5 rounded-full`}>
                              {item.badge.count}
                            </span>
                          )}
                        </>
                      )}

                      {/* Tooltip for collapsed menu */}
                      {collapsed && (
                        <span className="absolute left-full ml-2 p-1.5 px-2 rounded bg-gray-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                          {item.label}
                        </span>
                      )}

                      {/* Badge for collapsed menu */}
                      {collapsed && item.badge && (
                        <span className={`absolute top-0 right-0 w-4 h-4 ${item.badge.color} rounded-full text-[10px] flex items-center justify-center text-white font-bold`}>
                          {item.badge.count}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              }
              return null;
            })}
            
            <li className={`pt-4 mt-4 border-t border-gray-100 dark:border-slate-800 ${mounted ? 'animate-fade-in' : ''}`} style={{animationDelay: '0.35s'}}>
              <button
                onClick={logout}
                className={`flex ${collapsed ? 'justify-center p-3' : 'items-center p-3'} w-full text-left rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors group relative`}
              >
                <LogOut size={20} className={`text-gray-500 dark:text-gray-400 ${collapsed ? '' : 'mr-3'}`} />
                {!collapsed && <span>Logout</span>}

                {collapsed && (
                  <span className="absolute left-full ml-2 p-1.5 px-2 rounded bg-gray-900 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Logout
                  </span>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
