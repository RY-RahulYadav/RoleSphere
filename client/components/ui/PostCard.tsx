'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Edit, 
  Trash2, 
  Send, 
  MoreHorizontal,
  Clock,
  Bookmark,
  BookmarkCheck,
  AlertCircle,
  Copy
} from 'lucide-react';
import { formatDate } from '@/utils/helpers';
import { apiRequest } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { Post, User, Comment as PostComment } from '@/types';

interface PostCardProps {
  post: Post;
  onDeletePost?: (id: string) => void;
  onUpdatePost?: (id: string) => void;
  showActions?: boolean;
}

export default function PostCard({ post, onDeletePost, onUpdatePost, showActions = true }: PostCardProps) {
  const { user, token } = useAuth();
  const [isLiked, setIsLiked] = useState<boolean>(
    post.likes ? post.likes.includes(user?.id || '') : false
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(post.likes?.length || 0);
  const [commentContent, setCommentContent] = useState<string>('');
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<PostComment[]>(post.comments || []);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [showCopiedToast, setShowCopiedToast] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const commentInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const isAuthor = user?.id === (typeof post.author === 'string' ? post.author : post.author?.id);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);
  
  const handleLike = async () => {
    if (!token) return;
    
    try {
      const response = await apiRequest<{message: string, likes: number}>(`/posts/${post._id}/like`, 'POST', {}, token);
      setIsLiked(!isLiked);
      setLikesCount(response.likes);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };
  
  const handleAddComment = async () => {
    if (!commentContent.trim() || !token || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await apiRequest<{message: string, post: Post}>(`/posts/${post._id}/comment`, 'POST', { content: commentContent }, token);
      setComments(response.post.comments || []);
      setCommentContent('');
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getAuthorName = (): string => {
    if (typeof post.author === 'string') {
      return 'Unknown User';
    }
    return `${post.author?.firstName} ${post.author?.middleName ? post.author.middleName + ' ' : ''}${post.author?.lastName}` || 'Unknown User';
  };
  
  const getCommentAuthorName = (comment: PostComment): string => {
    if (typeof comment.author === 'string') {
      return 'Unknown User';
    }
    return `${comment.author?.firstName} ${comment.author?.middleName ? comment.author.middleName + ' ' : ''}${comment.author?.lastName}` || 'Unknown User';
  };

  const getAuthorRole = (): string => {
    if (typeof post.author === 'string') {
      return '';
    }
    return post.author?.role || '';
  };

  const handleSavePost = () => {
    setIsSaved(!isSaved);
    // Here you would typically save this to your backend/localStorage
  };

  const handleSharePost = () => {
    // Copy post link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/posts/${post._id}`);
    setShowCopiedToast(true);
    setTimeout(() => setShowCopiedToast(false), 2000);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    // Focus comment input when opening comments
    if (!showComments && commentInputRef.current) {
      setTimeout(() => {
        commentInputRef.current?.focus();
      }, 100);
    }
  };

  // Get background color based on user role
  const getAuthorBgColor = (): string => {
    const role = getAuthorRole();
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-indigo-600 to-purple-600';
      case 'editor': return 'bg-gradient-to-r from-blue-600 to-cyan-600';
      case 'viewer': return 'bg-gradient-to-r from-emerald-600 to-teal-600';
      default: return 'bg-gradient-to-r from-blue-600 to-purple-600';
    }
  };
  
  // Get role badge style
  const getRoleBadge = (): React.ReactNode => {
    const role = getAuthorRole();
    if (!role) return null;
    
    let badgeStyle = '';
    let roleText = '';
    
    switch (role) {
      case 'admin':
        badgeStyle = 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
        roleText = 'Admin';
        break;
      case 'editor':
        badgeStyle = 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        roleText = 'Editor';
        break;
      case 'viewer':
        badgeStyle = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        roleText = 'Viewer';
        break;
      default:
        return null;
    }
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeStyle}`}>
        {roleText}
      </span>
    );
  };

  // Handle key press in comment input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow duration-300">
      {/* Post Header */}
      <div className="flex items-center p-4 sm:p-5 border-b border-gray-100 dark:border-slate-800">
        <div className={`h-10 w-10 rounded-full ${getAuthorBgColor()} flex items-center justify-center text-white font-bold shadow-sm`}>
          {getAuthorName().charAt(0).toUpperCase()}
        </div>
        <div className="ml-3 flex-grow">
          <div className="flex items-center">
            <p className="font-medium text-gray-900 dark:text-white">{getAuthorName()}</p>
            <div className="ml-2">{getRoleBadge()}</div>
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            <Clock size={12} className="mr-1" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition"
            aria-label="Post options"
          >
            <MoreHorizontal size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-10 animate-fade-in">
              {isAuthor && showActions && onUpdatePost && (
                <button 
                  onClick={() => { onUpdatePost(post._id); setIsMenuOpen(false); }}
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-t-lg"
                >
                  <Edit size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                  Edit post
                </button>
              )}
              
              {isAuthor && showActions && onDeletePost && (
                <button 
                  onClick={() => { onDeletePost(post._id); setIsMenuOpen(false); }}
                  className="flex w-full items-center px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete post
                </button>
              )}
              
              <button 
                onClick={() => { handleSavePost(); setIsMenuOpen(false); }}
                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                {isSaved ? 
                  <BookmarkCheck size={16} className="mr-2 text-blue-500" /> : 
                  <Bookmark size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                }
                {isSaved ? 'Saved' : 'Save post'}
              </button>
              
              <button 
                onClick={() => { handleSharePost(); setIsMenuOpen(false); }}
                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-b-lg"
              >
                <Copy size={16} className="mr-2 text-gray-500 dark:text-gray-400" />
                Copy link
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Post Content */}
      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">{post.title}</h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{post.content}</p>
      </div>
      
      {/* Post Image (if exists) */}
      {post.image && (
        <div className="relative w-full h-80 sm:h-96">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Post Stats */}
      <div className="flex items-center px-4 sm:px-5 py-3 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-slate-800">
        <div className="mr-6 flex items-center">
          <Heart size={16} className={`mr-1.5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
        </div>
        <div className="flex items-center cursor-pointer" onClick={toggleComments}>
          <MessageCircle size={16} className="mr-1.5" />
          <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
        </div>
      </div>
      
      {/* Post Actions */}
      <div className="flex border-t border-gray-100 dark:border-slate-800">
        <button 
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center py-3 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors ${
            isLiked ? 'text-rose-500' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Heart size={18} className={isLiked ? 'fill-rose-500' : ''} />
          <span className="ml-2 font-medium text-sm">Like</span>
        </button>
        <button 
          onClick={toggleComments}
          className="flex-1 flex items-center justify-center py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
        >
          <MessageCircle size={18} />
          <span className="ml-2 font-medium text-sm">Comment</span>
        </button>
        <button 
          onClick={handleSharePost}
          className="flex-1 flex items-center justify-center py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors"
        >
          <Share2 size={18} />
          <span className="ml-2 font-medium text-sm">Share</span>
        </button>
      </div>
      
      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-100 dark:border-slate-800 p-4 sm:p-5 animate-fade-in">
          {/* Comment Input */}
          <div className="flex items-start mb-4">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3 mt-1 flex-shrink-0">
              {user?.firstName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-grow relative">
              <input
                type="text"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                onKeyDown={handleKeyPress}
                ref={commentInputRef}
                placeholder="Write a comment..."
                className="w-full border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-full py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button 
                onClick={handleAddComment}
                disabled={!commentContent.trim() || isSubmitting}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} className={isSubmitting ? 'animate-pulse' : ''} />
              </button>
            </div>
          </div>
          
          {/* Comments List */}
          <div className="space-y-4 max-h-96 overflow-y-auto px-2">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="flex animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
                  <div className={`h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3 mt-1 flex-shrink-0`}>
                    {getCommentAuthorName(comment).charAt(0).toUpperCase()}
                  </div>
                  <div className="bg-gray-100 dark:bg-slate-800 rounded-2xl px-4 py-2 text-sm flex-grow">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-gray-900 dark:text-white">{getCommentAuthorName(comment)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(comment.createdAt)}</p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <MessageCircle size={28} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No comments yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Be the first to comment on this post</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Copy notification toast */}
      {showCopiedToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 dark:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in">
          <Copy size={16} />
          <span>Link copied to clipboard</span>
        </div>
      )}
    </div>
  );
}
