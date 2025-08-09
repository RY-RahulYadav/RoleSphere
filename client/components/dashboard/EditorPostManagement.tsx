'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';
import { Post } from '@/types';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function EditorPostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const { token, user } = useAuth();
  const isEditor = user?.role === 'editor' || user?.role === 'admin';

  useEffect(() => {
    fetchEditorPosts();
  }, [token]);

  const fetchEditorPosts = async () => {
    if (!token || !isEditor) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const fetchedPosts = await apiRequest<Post[]>('/posts/editor/my-posts', 'GET', undefined, token);
      setPosts(fetchedPosts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your posts');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setSelectedPost(null);
    setFormData({ title: '', content: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (post: Post) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      content: post.content
    });
    setIsModalOpen(true);
  };

  const openDeleteModal = (post: Post) => {
    setSelectedPost(post);
    setIsDeleteModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !isEditor) return;
    
    const { title, content } = formData;
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      if (selectedPost) {
        // Update existing post
        const updatedPost = await apiRequest<{ post: Post }>(
          `/posts/${selectedPost._id}`,
          'PUT',
          { title, content },
          token
        );
        
        setPosts(posts.map(post => 
          post._id === selectedPost._id ? updatedPost.post : post
        ));
      } else {
        // Create new post
        const newPost = await apiRequest<{ post: Post }>(
          '/posts',
          'POST',
          { title, content },
          token
        );
        
        setPosts([newPost.post, ...posts]);
      }
      
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save post');
    }
  };

  const handleDelete = async () => {
    if (!selectedPost || !token || !isEditor) return;
    
    try {
      await apiRequest<{ message: string }>(
        `/posts/${selectedPost._id}`,
        'DELETE',
        undefined,
        token
      );
      
      setPosts(posts.filter(post => post._id !== selectedPost._id));
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to delete post');
    }
  };

  if (!isEditor) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-4">
        <div className="flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <p>You need editor or administrator permissions to manage posts.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading your posts...</div>;
  }

  return (
    <div className="relative">
      <div className={`${isModalOpen || isDeleteModalOpen ? 'opacity-25 pointer-events-none transition-opacity' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            {user?.role === 'admin' ? 'My Posts (Admin)' : 'My Posts'}
          </h1>
          <button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-md flex items-center transition-all"
          >
            <Plus size={16} className="mr-2" />
            New Post
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="mr-3 flex-shrink-0" size={20} />
              <p>{error}</p>
            </div>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">You haven't created any posts yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map(post => (
              <div key={post._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {post.content.length > 150
                      ? `${post.content.substring(0, 150)}...`
                      : post.content}
                  </p>
                  <div className="text-sm text-gray-500">
                    <span>Created: {formatDate(post.createdAt)}</span>
                    {post.updatedAt !== post.createdAt && (
                      <span className="ml-4">Updated: {formatDate(post.updatedAt)}</span>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2">
                  <button
                    onClick={() => openEditModal(post)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => openDeleteModal(post)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-slate-700 animate-fade-in">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b pb-4 flex items-center">
              {selectedPost ? (
                <>
                  <Edit size={20} className="mr-2 text-blue-600" />
                  Edit Post
                </>
              ) : (
                <>
                  <Plus size={20} className="mr-2 text-blue-600" />
                  Create New Post
                </>
              )}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow-sm appearance-none border border-gray-300 dark:border-slate-600 rounded-lg w-full py-3 px-4 text-gray-700 dark:text-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter post title"
                  required
                  autoFocus
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="shadow-sm appearance-none border border-gray-300 dark:border-slate-600 rounded-lg w-full py-3 px-4 text-gray-700 dark:text-white dark:bg-slate-700 h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Write your post content here..."
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-4 pt-3 border-t border-gray-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
                >
                  {selectedPost ? 'Update Post' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {isDeleteModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-slate-700 animate-fade-in">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white border-b pb-4 flex items-center">
              <Trash2 size={20} className="mr-2 text-red-600" />
              Confirm Delete
            </h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300 py-2">
              Are you sure you want to delete "<span className="font-semibold text-gray-900 dark:text-white">{selectedPost.title}</span>"? <br />
              <span className="text-red-600 dark:text-red-400 text-sm mt-2 inline-block">This action cannot be undone.</span>
            </p>
            
            <div className="flex justify-end space-x-4 pt-3 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-6 py-3 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
