import { ApiError } from '@/types';

const API_URL = 'http://localhost:5000/api';

// Error handling utility function
export function handleApiError(err: any): string {
  // Check for network errors
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    return 'Network error: Could not connect to server';
  }

  // Check for payload size errors
  if (err.message && (
    err.message.includes('PayloadTooLargeError') || 
    err.message.includes('request entity too large')
  )) {
    return 'Only images below 1MB are allowed. Please select a smaller image.';
  }

  // Return the error message or a generic message if none is available
  return err.message || 'An unexpected error occurred';
}

// Helper function for API requests
export async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result as T;
}
