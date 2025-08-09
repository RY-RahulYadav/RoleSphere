'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UserManagement from '@/components/dashboard/UserManagement';
import { hasRole } from '@/utils/helpers';

export default function UsersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Redirect if not logged in or not an admin
      if (!user) {
        router.replace('/login');
      } else if (!hasRole(user, ['admin'])) {
        router.replace('/dashboard');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !hasRole(user, ['admin'])) {
    return null; // Will redirect in useEffect
  }

  return (
    <DashboardLayout>
      <UserManagement />
    </DashboardLayout>
  );
}
