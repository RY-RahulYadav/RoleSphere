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
        <header className="bg-white dark:bg-slate-800 shadow-md border-b border-gray-200 dark:border-slate-700 sticky top-0 z-20">
          <div className="px-3 sm:px-6">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Page Title - Added left padding for mobile to prevent overlap with menu button */}
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[180px] sm:max-w-none pl-10 lg:pl-0">
                {getPageTitle()}
              </h1>
              
              {/* Desktop Navigation */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* User Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1 sm:space-x-2 p-1 sm:p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 dark:focus:ring-brand-primary/30"
                  >
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-r ${roleColor} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {user?.firstName || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {user?.role || 'User'}
                      </div>
                    </div>
                    <ChevronDown size={14} className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''} hidden sm:block ml-1`} />
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-1 w-[280px] sm:w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 z-30 animate-scale-in origin-top-right">
                      <div className="p-3 sm:p-4 border-b border-gray-100 dark:border-slate-700">
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{user?.firstName} {user?.middleName ? user?.middleName + ' ' : ''}{user?.lastName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{user?.email}</p>
                        <div className="mt-2 flex items-center">
                          <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-gradient-to-r ${roleColor} text-white`}>
                            {user?.role}
                          </span>
                        </div>
                      </div>
                      
                      <div className="py-1 sm:py-2">
                        <Link 
                          href="/dashboard/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2 sm:mr-3">
                            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                              {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          Profile
                        </Link>
                        
                        <Link 
                          href="/dashboard/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-2 sm:mr-3">
                            <Settings size={14} className="text-gray-600 dark:text-gray-400 sm:text-[16px]" />
                          </div>
                          Settings
                        </Link>
                      </div>
                      
                      <div className="py-1 sm:py-2 border-t border-gray-100 dark:border-slate-700">
                        <button
                          onClick={() => {
                            logout();
                            setDropdownOpen(false);
                          }}
                          className="flex w-full items-center px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mr-2 sm:mr-3">
                            <LogOut size={14} className="text-red-600 dark:text-red-400 sm:text-[16px]" />
                          </div>
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
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 py-3 sm:py-4 px-3 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center text-center sm:text-left mb-2 sm:mb-0">
              <div className="h-6 w-6 rounded-md bg-brand-gradient flex items-center justify-center text-white font-bold text-xs shadow-sm mr-2">
                RS
              </div>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} RoleSphere. All rights reserved.</p>
            </div>
            <div className="flex space-x-3 sm:space-x-6">
              <Link href="#" className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors">
                Terms
              </Link>
              <Link href="#" className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-brand-primary dark:hover:text-brand-secondary transition-colors">
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
