import { useState, useEffect } from 'react';
import { createPost, getCommunities } from '../../services/api';

const CreatePostModal = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingCommunities, setFetchingCommunities] = useState(false);

  // Fetch communities when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCommunities();
    }
  }, [isOpen]);

  const fetchCommunities = async () => {
    setFetchingCommunities(true);
    try {
      const data = await getCommunities();
      setCommunities(data);
    } catch (error) {
      console.error('Failed to fetch communities:', error);
      setError('Failed to load communities');
    } finally {
      setFetchingCommunities(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!communityId) {
      setError('Please select a community');
      return;
    }

    setLoading(true);

    try {
      await createPost(communityId, title, content, postType);
      setLoading(false);
      onSuccess();
      onClose();
      // Reset form
      setTitle('');
      setContent('');
      setPostType('');
      setCommunityId('');
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to create post');
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
          Create Post
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-800">{error}</div>
            </div>
          )}

          {/* Community Selector */}
          <div>
            <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
              Community *
            </label>
            {fetchingCommunities ? (
              <div className="text-sm text-gray-600">Loading communities...</div>
            ) : (
              <select
                id="community"
                required
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select a community...</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    r/{community.name}
                  </option>
                ))}
              </select>
            )}
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
              disabled={loading || fetchingCommunities}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
