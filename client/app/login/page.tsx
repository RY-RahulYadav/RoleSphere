'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { Globe, Moon, Sun } from 'lucide-react';

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  
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
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 font-bold text-gray-900 dark:text-white">Social Dashboard</span>
        </div>
        
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>
      
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex-col justify-center items-center p-12">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-6">Welcome to Social Dashboard</h1>
            <p className="text-lg mb-8 text-blue-100">
              A powerful platform for managing your social content, users, and analytics with role-based permissions.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Admin</h3>
                <p className="text-sm text-blue-100">Full access to manage users, content, and system logs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Editor</h3>
                <p className="text-sm text-blue-100">Create and manage content, engage with users</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Viewer</h3>
                <p className="text-sm text-blue-100">Read-only access to browse content and interact</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-blue-100">Track engagement and monitor performance</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {isLoginView ? <LoginForm /> : <RegisterForm />}
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {isLoginView 
                  ? "Don't have an account? Register" 
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="w-full p-4 text-center text-sm text-gray-500 dark:text-gray-400">
        &copy; 2025 Social Dashboard. All rights reserved.
      </footer>
    </div>
  );
}
