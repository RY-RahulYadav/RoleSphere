'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { apiRequest } from '@/utils/api';
import { AlertCircle, Check } from 'lucide-react';

export default function Profile() {
  const { user, login } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Email is not included in updateData as it cannot be changed
      const updateData: Partial<User> = {
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        // email is intentionally omitted to prevent changes
      };
      
      // Get token from localStorage or auth context
      const token = localStorage.getItem('token');
      const response = await apiRequest<{message: string; user: User; token?: string}>('/auth/profile', 'PUT', updateData, token);
      
      setSuccessMessage(response.message || 'Profile updated successfully');
      
      // If we got back a user and token, update the auth context
      if (response.user && response.token) {
        login(response.token, response.user);
      } else if (response.user && user) {
        // Just update the user in context with same token
        login(localStorage.getItem('token') || '', response.user);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          <div className="flex items-center">
            <Check className="mr-2" size={20} />
            <p>{successMessage}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">
                  Middle Name
                </label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <span className="text-xs text-gray-500 italic">Cannot be changed</span>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                readOnly
                className="mt-1 block w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-md shadow-sm p-2 cursor-not-allowed"
                title="Email address cannot be changed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Contact support if you need to change your email address
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
