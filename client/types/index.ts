export interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface Comment {
  _id?: string;
  content: string;
  author: User | string;
  createdAt: string;
}

export interface Post {
  _id: string;
  title: string;
  content: string;
  image?: string;
  author: User | string;
  likes?: string[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Log {
  _id: string;
  user: User | string;
  action: string;
  details: string;
  timestamp: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
}
