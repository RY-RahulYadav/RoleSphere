import { ApiError } from '@/types';

const API_URL = 'http://localhost:5000/api';

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
