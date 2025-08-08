'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { 
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const pathname = usePathname();

  useEffect(() => {
    // Check system preference for dark mode
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
    setMounted(true);
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Get the page title based on the current route
  const getPageTitle = () => {
    const route = pathname.split('/').pop();
    
    switch (route) {
      case 'dashboard': return 'Dashboard';
      case 'posts': return 'News Feed';
      case 'create-post': return 'Create Post';
      case 'editor-posts': return 'My Posts';
      case 'users': return 'User Management';
      case 'logs': return 'System Logs';
      case 'profile': return 'Profile';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  // Role-based color schemes
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-indigo-600 to-purple-600';
      case 'editor': return 'from-blue-600 to-cyan-600';
      case 'viewer': return 'from-emerald-600 to-teal-600';
      default: return 'from-blue-600 to-purple-600';
    }
  };

  const roleColor = user ? getRoleColor(user.role) : 'from-blue-600 to-purple-600';
  
  return (
    <div className={`flex min-h-screen bg-gray-50 dark:bg-slate-900 ${mounted ? 'transition-colors' : ''}`}>
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-0">
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-slate-700 sticky top-0 z-20">
          <div className="px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              {/* Page Title */}
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {getPageTitle()}
              </h1>
              
              {/* Desktop Navigation */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                
                {/* User Menu */}
                <div className="relative ml-1 sm:ml-2">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${roleColor} flex items-center justify-center text-white font-bold shadow-sm`}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown size={16} className={`text-gray-500 dark:text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''} hidden sm:block`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 z-30 animate-fade-in">
                      <div className="p-3 border-b border-gray-100 dark:border-slate-700">
                        <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        <p className="mt-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 py-0.5 px-2 rounded-full w-fit capitalize">
                          {user?.role}
                        </p>
                      </div>
                      
                      <div className="py-1">
                        <Link 
                          href="/dashboard/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <span className="w-5 h-5 mr-3">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                          Profile
                        </Link>
                        
                        <Link 
                          href="/dashboard/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                        >
                          <Settings size={16} className="mr-3" />
                          Settings
                        </Link>
                      </div>
                      
                      <div className="py-1 border-t border-gray-100 dark:border-slate-700">
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut size={16} className="mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-4 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="text-center sm:text-left mb-2 sm:mb-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">&copy; 2025 Social Dashboard. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Privacy
              </Link>
              <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Terms
              </Link>
              <Link href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                Contact
              </Link>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Overlay for dropdowns */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-10 bg-transparent" 
          onClick={() => setDropdownOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
