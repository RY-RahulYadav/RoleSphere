'use client';

import { useAuth } from '@/context/AuthContext';
import { hasRole } from '@/utils/helpers';
import { BarChart2, Users, FileText, Activity } from 'lucide-react';

export default function DashboardOverview() {
  const { user } = useAuth();

  const isAdmin = user && hasRole(user, ['admin']);
  const isEditor = user && hasRole(user, ['admin', 'editor']);
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Welcome, {user?.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FileText size={24} />
            </div>
            <div className="ml-4">
              <p className="text-gray-500 text-sm">Content</p>
              <p className="text-xl font-semibold">Posts</p>
            </div>
          </div>
          <div className="mt-4">
            <a 
              href="/dashboard/posts" 
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              View all posts →
            </a>
          </div>
        </div>
        
        {isEditor && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FileText size={24} />
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Management</p>
                <p className="text-xl font-semibold">Content Management</p>
              </div>
            </div>
            <div className="mt-4">
              <a 
                href="/dashboard/posts" 
                className="text-green-500 hover:text-green-700 text-sm font-medium"
              >
                Create or edit content →
              </a>
            </div>
          </div>
        )}
        
        {isAdmin && (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <Users size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Administration</p>
                  <p className="text-xl font-semibold">User Management</p>
                </div>
              </div>
              <div className="mt-4">
                <a 
                  href="/dashboard/users" 
                  className="text-purple-500 hover:text-purple-700 text-sm font-medium"
                >
                  Manage users →
                </a>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                  <Activity size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-gray-500 text-sm">Monitoring</p>
                  <p className="text-xl font-semibold">System Logs</p>
                </div>
              </div>
              <div className="mt-4">
                <a 
                  href="/dashboard/logs" 
                  className="text-orange-500 hover:text-orange-700 text-sm font-medium"
                >
                  View activity logs →
                </a>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Your Role Permissions</h2>
        
        <div className="space-y-3">
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full ${isAdmin ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
            <span className="text-sm">Manage users and roles</span>
          </div>
          
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full ${isAdmin ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
            <span className="text-sm">View system logs</span>
          </div>
          
          <div className="flex items-center">
            <div className={`h-3 w-3 rounded-full ${isEditor ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></div>
            <span className="text-sm">Create and edit content</span>
          </div>
          
          <div className="flex items-center">
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">View content</span>
          </div>
        </div>
      </div>
    </div>
  );
}
