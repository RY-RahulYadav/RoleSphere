'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';
import { Post } from '@/types';
import { 
  AlertCircle, 
  PlusCircle, 
  FileText, 
  RefreshCw, 
  Search, 
  Filter,
  ThumbsUp,
  MessageSquare,
  Calendar 
} from 'lucide-react';
import PostCard from '../ui/PostCard';
import Link from 'next/link';

export default function AllPostsView() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'likes' | 'comments'>('recent');

  const { token, user } = useAuth();

  useEffect(() => {
    fetchAllPosts();
  }, [token]);

  useEffect(() => {
    if (posts.length > 0) {
      let results = [...posts];
      
      // Apply search filter
      if (searchTerm.trim() !== '') {
        results = results.filter(post => 
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply sorting
      if (sortBy === 'recent') {
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortBy === 'likes') {
        results.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
      } else if (sortBy === 'comments') {
        results.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
      }
      
      setFilteredPosts(results);
    } else {
      setFilteredPosts([]);
    }
  }, [posts, searchTerm, sortBy]);

  const fetchAllPosts = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const fetchedPosts = await apiRequest<Post[]>('/posts', 'GET', undefined, token);
      setPosts(fetchedPosts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPosts = async () => {
    if (!token || isRefreshing) return;
    
    setIsRefreshing(true);
    setError('');
    
    try {
      const fetchedPosts = await apiRequest<Post[]>('/posts', 'GET', undefined, token);
      setPosts(fetchedPosts);
    } catch (err: any) {
      setError(err.message || 'Failed to refresh posts');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 animate-pulse">Loading posts...</p>
      </div>
    );
  }

  const getSortIcon = () => {
    switch (sortBy) {
      case 'recent': return <Calendar size={16} className="mr-2" />;
      case 'likes': return <ThumbsUp size={16} className="mr-2" />;
      case 'comments': return <MessageSquare size={16} className="mr-2" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">News Feed</h1>
          <p className="text-gray-500 mt-1">Discover the latest posts from our community</p>
        </div>
        
        {user && user.role !== 'viewer' && (
          <Link 
            href="/dashboard/create-post" 
            className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            <PlusCircle size={18} className="mr-2" />
            Create Post
          </Link>
        )}
      </div>
      
      {/* Search and filters */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:text-white"
          />
        </div>
        
        <div className="flex items-center gap-2 self-end">
          <div className="relative">
            <button
              className="flex items-center px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {getSortIcon()}
              <span>Sort by: </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'likes' | 'comments')}
                className="ml-1 bg-transparent focus:outline-none appearance-none text-blue-600 dark:text-blue-400 font-medium"
              >
                <option value="recent">Recent</option>
                <option value="likes">Most liked</option>
                <option value="comments">Most discussed</option>
              </select>
            </button>
          </div>
          
          <button
            onClick={refreshPosts}
            disabled={isRefreshing}
            className="p-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-gray-200 disabled:opacity-50"
          >
            <RefreshCw size={18} className={`${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-6 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <AlertCircle className="mr-3 flex-shrink-0" size={20} />
            <p>{error}</p>
          </div>
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm p-10 text-center border border-gray-100 dark:border-slate-700 animate-fade-in">
          {searchTerm ? (
            <>
              <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                <Search size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No matching posts</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
              <button 
                onClick={() => setSearchTerm('')} 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                <FileText size={40} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Be the first to share something with the community!</p>
              
              {user && user.role !== 'viewer' && (
                <Link 
                  href="/dashboard/create-post" 
                  className="inline-flex items-center mt-6 px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <PlusCircle size={16} className="mr-2" />
                  Create Post
                </Link>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-gray-500 text-sm mb-4">Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}</p>
          {filteredPosts.map((post, index) => (
            <div key={post._id} className="animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
