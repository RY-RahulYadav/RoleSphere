import { User } from '@/types';

// Check if a user has specific role
export const hasRole = (
  user: User | null, 
  roles: ('admin' | 'editor' | 'viewer')[]
): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

// Format date string
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};
