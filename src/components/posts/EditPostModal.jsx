import { useState, useEffect } from 'react';
import { updatePost } from '../../services/api';

const EditPostModal = ({ isOpen, onClose, onSuccess, post }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill form when post changes
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setPostType(post.post_type);
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updatePost(post.id, title, content, postType);
      setLoading(false);
      onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to update post');
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Edit Post
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Community (Read-only) */}
          <div>
            <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
              Community
            </label>
            <input
              id="community"
              type="text"
              value={`r/${post?.community?.name || 'Unknown'}`}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Community cannot be changed</p>
          </div>
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="An interesting title for your post"
            />
            <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
          </div>

          {/* Post Type */}
          <div>
            <label htmlFor="postType" className="block text-sm font-medium text-gray-700 mb-1">
              Post Type *
            </label>
            <input
              id="postType"
              type="text"
              required
              maxLength={100}
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Discussion, Question, Link, Image"
            />
          </div>
          
          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content *
            </label>
            <textarea
              id="content"
              required
              maxLength={40000}
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Share your thoughts..."
            />
            <p className="text-xs text-gray-500 mt-1">{content.length}/40,000 characters</p>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
