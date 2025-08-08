'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { LogIn, MessageCircle, Heart, Users, FileText, Bell, Shield } from 'lucide-react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SocialHub
                </span>
              </div>
            </div>
            
            <div className="flex items-center">
              {!user && (
                <Link
                  href="/login"
                  className="ml-4 px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center transition-colors"
                >
                  <LogIn size={18} className="mr-2" />
                  Log in
                </Link>
              )}
              {user && (
                <Link
                  href="/dashboard"
                  className="ml-4 px-4 py-2 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-24 lg:pb-32">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Share, Connect, Engage</span>
                  <span className="block mt-2">Social Media Platform</span>
                </h1>
                <p className="mt-6 text-xl text-blue-100">
                  A modern social platform with role-based access control. Create, share, and engage with content based on your role.
                </p>
                <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center">
                  <div className="rounded-md shadow">
                    <Link
                      href="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      <LogIn className="mr-2" size={20} />
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 inset-0 flex items-center justify-center opacity-20">
            <div className="w-96 h-96 rounded-full bg-white"></div>
          </div>
          <div className="absolute bottom-0 right-0 opacity-20">
            <div className="w-64 h-64 rounded-full bg-white"></div>
          </div>
          <div className="absolute top-0 left-0 opacity-20">
            <div className="w-32 h-32 rounded-full bg-white"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Everything you need in one platform
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Engage with others through posts, comments, and likes while maintaining different access levels.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                  <MessageCircle className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Social Interaction</h3>
                <p className="mt-3 text-base text-gray-500">
                  Create posts, comment on content, and like posts from your peers.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Role-Based Access</h3>
                <p className="mt-3 text-base text-gray-500">
                  Different roles with specific permissions - admin, editor, and viewer.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-xl font-medium text-gray-900">Secure Platform</h3>
                <p className="mt-3 text-base text-gray-500">
                  Built with security in mind, protecting user data and content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">User Roles</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Designed for different users
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our platform provides different capabilities based on your role.
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-6">
              <div className="relative p-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-2 -mr-8 w-24 h-24 rounded-full bg-purple-100 opacity-50"></div>
                <div className="relative">
                  <div className="bg-purple-100 rounded-lg p-3 inline-flex">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Admin Role</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Full control over the platform. Manage users, monitor system logs, and oversee all content.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                        <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                      </span>
                      <span className="text-gray-700">User management</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                        <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                      </span>
                      <span className="text-gray-700">System logs access</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                        <span className="h-2 w-2 bg-purple-600 rounded-full"></span>
                      </span>
                      <span className="text-gray-700">Content moderation</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative p-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-2 -mr-8 w-24 h-24 rounded-full bg-green-100 opacity-50"></div>
                <div className="relative">
                  <div className="bg-green-100 rounded-lg p-3 inline-flex">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Editor Role</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Create and manage content. Post updates, moderate comments, and engage with users.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <span className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                      </span>
                      <span className="text-gray-700">Create posts</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                      </span>
                      <span className="text-gray-700">Edit own content</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                      </span>
                      <span className="text-gray-700">Manage comments</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative p-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="absolute top-0 right-0 -mt-2 -mr-8 w-24 h-24 rounded-full bg-blue-100 opacity-50"></div>
                <div className="relative">
                  <div className="bg-blue-100 rounded-lg p-3 inline-flex">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Viewer Role</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Consume and engage with content. Like posts and leave comments on the platform.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <span className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                      </span>
                      <span className="text-gray-700">View all posts</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                      </span>
                      <span className="text-gray-700">Like content</span>
                    </li>
                    <li className="flex items-center">
                      <span className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="h-2 w-2 bg-blue-600 rounded-full"></span>
                      </span>
                      <span className="text-gray-700">Comment on posts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to get started?</span>
              <span className="block text-blue-100">Join our community today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50"
                >
                  Get started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6">
            <Link href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Link>
          </div>
          <p className="mt-8 text-center text-base text-gray-500">
            &copy; 2025 SocialHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

