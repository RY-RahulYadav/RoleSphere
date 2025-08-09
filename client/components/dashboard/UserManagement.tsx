'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';
import { User } from '@/types';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'editor' | 'viewer'>('viewer');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const { token, user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const fetchedUsers = await apiRequest<User[]>('/users', 'GET', undefined, token);
      setUsers(fetchedUsers);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !token) return;
    
    try {
      // Use _id instead of id for MongoDB
      const userId = selectedUser._id || selectedUser.id;
      
      await apiRequest<User>(
        `/users/${userId}/role`,
        'PUT',
        { role: selectedRole },
        token
      );
      
      setUsers(users.map(user => 
        (user._id === userId || user.id === userId) ? { ...user, role: selectedRole } : user
      ));
      
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Role change error:', err);
      setError(`Failed to update user role: ${err.message || 'Unknown error'}`);
      // Keep modal open on error
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser || !token) return;
    
    try {
      // Use _id instead of id for MongoDB
      const userId = selectedUser._id || selectedUser.id;
      
      await apiRequest<{ message: string }>(
        `/users/${userId}`,
        'DELETE',
        undefined,
        token
      );
      
      setUsers(users.filter(user => user._id !== userId && user.id !== userId));
      setIsConfirmDeleteOpen(false);
    } catch (err: any) {
      console.error('Delete user error:', err);
      setError(`Failed to delete user: ${err.message || 'Unknown error'}`);
      // Keep modal open on error
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setSelectedRole(user.role);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsConfirmDeleteOpen(true);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading users...</div>;
  }

  // Show error as an alert but don't replace the entire component
  const errorDisplay = error ? (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
      <div className="flex items-center">
        <AlertCircle className="mr-2" size={20} />
        <p>{error}</p>
      </div>
      <button 
        onClick={() => setError('')}
        className="mt-2 text-sm text-red-700 hover:text-red-900 underline"
      >
        Dismiss
      </button>
    </div>
  ) : null;

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">User Management</h1>
      
      {errorDisplay}
      
      <div className="bg-white shadow rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Email
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px] sm:max-w-none">
                    {`${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`}
                  </div>
                  {/* Show email on mobile only */}
                  <div className="text-[10px] text-gray-500 sm:hidden truncate max-w-[120px]">{user.email}</div>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-xs sm:text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                  <span className={`px-1.5 sm:px-2 py-0.5 inline-flex text-[10px] sm:text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : user.role === 'editor'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                  {currentUser?.id !== user.id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit size={16} className="sm:size-[18px]" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} className="sm:size-[18px]" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Role Modal */}
      <Modal
        isOpen={isModalOpen && selectedUser !== null}
        onClose={() => setIsModalOpen(false)}
        title="Edit User Role"
      >
        {selectedUser && (
          <>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Change role for <span className="font-medium text-blue-600">{selectedUser.firstName} {selectedUser.lastName}</span>
            </p>
            
            <div className="mb-3 sm:mb-4">
              <label className="block text-gray-700 text-xs sm:text-sm font-bold mb-1.5 sm:mb-2">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'editor' | 'viewer')}
                className="shadow border rounded w-full py-1.5 sm:py-2 px-2 sm:px-3 text-gray-700 text-xs sm:text-sm"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium sm:font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRoleChange}
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium sm:font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm"
              >
                Save Changes
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={isConfirmDeleteOpen && selectedUser !== null}
        onClose={() => setIsConfirmDeleteOpen(false)}
        title="Confirm Delete"
      >
        {selectedUser && (
          <>
            <p className="mb-3 sm:mb-4 text-sm sm:text-base">
              Are you sure you want to delete <span className="font-medium text-red-600">{selectedUser.firstName} {selectedUser.lastName}</span>?
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium sm:font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="bg-red-500 hover:bg-red-700 text-white font-medium sm:font-bold py-1.5 sm:py-2 px-3 sm:px-4 rounded text-xs sm:text-sm"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
