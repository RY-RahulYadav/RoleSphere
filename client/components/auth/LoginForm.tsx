'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';
import { AuthResponse } from '@/types';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await apiRequest<AuthResponse>('/auth/login', 'POST', { 
        email, 
        password 
      });

      login(response.token, response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login for demo purposes - remove in production
  const loginAsDemoUser = async (role: 'admin' | 'editor' | 'viewer') => {
    setIsLoading(true);
    try {
      let demoCredentials = {
        email: '',
        password: 'password123'
      };
      
      switch (role) {
        case 'admin':
          demoCredentials.email = 'admin@example.com';
          break;
        case 'editor':
          demoCredentials.email = 'editor@example.com';
          break;
        case 'viewer':
          demoCredentials.email = 'viewer@example.com';
          break;
      }
      
      const response = await apiRequest<AuthResponse>('/auth/login', 'POST', demoCredentials);
      login(response.token, response.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 sm:p-10 rounded-xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700">
      <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">Welcome Back</h2>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Sign in to access your dashboard</p>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-6 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-white"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium">
              Password
            </label>
            <a href="#" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 dark:text-white"
              placeholder="••••••••"
              required
            />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </form>

      {/* Demo accounts section */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-4">Demo Accounts (Quick Login)</p>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => loginAsDemoUser('admin')}
            disabled={isLoading}
            className="py-2 px-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800/30 transition-colors"
          >
            Admin
          </button>
          <button
            onClick={() => loginAsDemoUser('editor')}
            disabled={isLoading}
            className="py-2 px-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-800/30 transition-colors"
          >
            Editor
          </button>
          <button
            onClick={() => loginAsDemoUser('viewer')}
            disabled={isLoading}
            className="py-2 px-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium hover:bg-emerald-200 dark:hover:bg-emerald-800/30 transition-colors"
          >
            Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
