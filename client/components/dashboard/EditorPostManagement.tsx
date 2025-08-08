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
  const isEditor = user?.role === 'editor';

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
          <p>You need editor permissions to manage posts.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading your posts...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Plus size={16} className="mr-1" />
          New Post
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="mr-2" size={20} />
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

      {/* Create/Edit Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
            <h3 className="text-lg font-bold mb-4">
              {selectedPost ? 'Edit Post' : 'Create New Post'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 h-40"
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {selectedPost ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {isDeleteModalOpen && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-4">
              Are you sure you want to delete "{selectedPost.title}"? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
