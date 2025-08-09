'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex">
      {/* Login/Register container */}
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center items-center mb-10">
            <Link href="/" className="flex items-center">
              <div className="h-10 w-10 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-bold text-xl shadow-lg">
                RS
              </div>
              <h1 className="ml-2 text-2xl font-bold text-brand-gradient">
                RoleSphere
              </h1>
            </Link>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isLoginView ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {isLoginView 
                  ? 'Enter your credentials to access your dashboard' 
                  : 'Fill in the form below to get started'}
              </p>
            </div>
            
            {isLoginView ? <LoginForm /> : <RegisterForm />}
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLoginView(!isLoginView)}
                className="text-sm text-brand-primary dark:text-brand-secondary hover:text-brand-secondary dark:hover:text-brand-primary transition-colors"
              >
                {isLoginView 
                  ? "Don't have an account? Register" 
                  : "Already have an account? Login"}
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
      
      {/* Right side decorative area */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-animated"></div>
        <div className="absolute inset-0 bg-[url('/globe.svg')] bg-no-repeat bg-center opacity-10"></div>
        
        <div className="relative h-full flex items-center justify-center p-12 z-10">
          <div className="max-w-lg">
            <div className="text-center md:text-left text-white mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Welcome to RoleSphere</h2>
              <p className="text-lg mb-8 text-white/80">
                A powerful platform for managing content, users, and analytics with personalized role-based dashboards.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-effect p-6 rounded-xl border border-white/10 shadow-lg animate-scale-in" style={{ animationDelay: '0ms' }}>
                <h3 className="text-xl font-semibold mb-3 text-white">Admin</h3>
                <p className="text-sm text-white/80">Full access to manage users, content, and system logs. Complete control over platform settings.</p>
              </div>
              
              <div className="glass-effect p-6 rounded-xl border border-white/10 shadow-lg animate-scale-in" style={{ animationDelay: '150ms' }}>
                <h3 className="text-xl font-semibold mb-3 text-white">Editor</h3>
                <p className="text-sm text-white/80">Create and manage content, engage with users, access analytics to track performance.</p>
              </div>
              
              <div className="glass-effect p-6 rounded-xl border border-white/10 shadow-lg col-span-1 md:col-span-2 animate-scale-in" style={{ animationDelay: '300ms' }}>
                <h3 className="text-xl font-semibold mb-3 text-white">Viewer</h3>
                <p className="text-sm text-white/80">Read-only access to browse content and interact with a clean, minimal interface focused on consumption.</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
