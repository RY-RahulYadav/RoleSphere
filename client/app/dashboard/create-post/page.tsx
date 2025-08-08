'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PostForm from '@/components/dashboard/PostForm';
import { hasRole } from '@/utils/helpers';

export default function CreatePostPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Redirect if not logged in
      if (!user) {
        router.replace('/login');
      } 
      // Redirect if not editor or admin
      else if (!hasRole(user, ['editor', 'admin'])) {
        router.replace('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !hasRole(user, ['editor', 'admin'])) {
    return null; // Will redirect in useEffect
  }

  return (
    <DashboardLayout>
      <PostForm />
    </DashboardLayout>
  );
}
