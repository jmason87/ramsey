import { useState } from 'react';
import { Link } from 'react-router';
import { deletePost, votePost, removeVote } from '../../services/api';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const PostCard = ({ post, onEdit, onDelete, currentUserId }) => {
  const [deleting, setDeleting] = useState(false);
  const [voteCount, setVoteCount] = useState(post.vote_count || 0);
  const [userVote, setUserVote] = useState(post.user_vote || null); // Will be 1, -1, or null
  const [voting, setVoting] = useState(false);

  const contentPreview = post.content?.length > 200 
    ? post.content.substring(0, 200) + '...' 
    : post.content;

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }

    setDeleting(true);
    try {
      await deletePost(post.id);
      onDelete(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    } finally {
      setDeleting(false);
    }
  };

  const handleVote = async (voteValue) => {
    if (voting) return; // Prevent double-clicks

    // Optimistic update
    const previousVote = userVote;
    const previousCount = voteCount;

    // Calculate new vote state
    let newVote = null;
    let newCount = voteCount;

    if (previousVote === voteValue) {
      // Clicking same vote = remove it
      newVote = null;
      newCount = voteCount - voteValue;
    } else if (previousVote === null) {
      // No previous vote = add new vote
      newVote = voteValue;
      newCount = voteCount + voteValue;
    } else {
      // Different vote = switch (delta is 2 or -2)
      newVote = voteValue;
      newCount = voteCount + (voteValue - previousVote);
    }

    // Apply optimistic update
    setUserVote(newVote);
    setVoteCount(newCount);
    setVoting(true);

    try {
      if (newVote === null) {
        // Remove vote
        await removeVote(post.id);
      } else {
        // Add or update vote
        await votePost(post.id, voteValue);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      // Rollback on error
      setUserVote(previousVote);
      setVoteCount(previousCount);
      alert('Failed to register vote');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 mb-4">
      {/* Header: Community and timestamp */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-sm text-gray-600">
          <Link
            to={`/communities/${post.community?.id}`}
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            r/{post.community?.name || 'Unknown'}
          </Link>
          <span className="mx-2">•</span>
          <span>Posted by u/{post.user?.username || 'Anonymous'}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(post.created_at)}</span>
        </div>

        {/* Show edit/delete only if user is the post author */}
        {Number(post.user?.id) === Number(currentUserId) && (
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(post)}
              className="text-indigo-600 hover:text-indigo-800 text-sm"
              title="Edit post"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
              title="Delete post"
            >
              {deleting ? (
                <span className="text-xs">...</span>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <Link to={`/posts/${post.id}`}>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 cursor-pointer">
          {post.title}
        </h3>
      </Link>

      {/* Content Preview */}
      <p className="text-gray-700 mb-4 whitespace-pre-line">
        {contentPreview}
      </p>

      {/* Footer: Vote count, comments, post type */}
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleVote(1)}
            disabled={voting}
            className={`transition-colors ${
              userVote === 1 
                ? 'text-orange-500' 
                : 'text-gray-400 hover:text-orange-500'
            } disabled:opacity-50`}
            title="Upvote"
          >
            <svg className="w-5 h-5" fill={userVote === 1 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className={`font-medium ${
            userVote === 1 ? 'text-orange-500' : userVote === -1 ? 'text-blue-500' : ''
          }`}>
            {voteCount}
          </span>
          <button
            onClick={() => handleVote(-1)}
            disabled={voting}
            className={`transition-colors ${
              userVote === -1 
                ? 'text-blue-500' 
                : 'text-gray-400 hover:text-blue-500'
            } disabled:opacity-50`}
            title="Downvote"
          >
            <svg className="w-5 h-5" fill={userVote === -1 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{post.comment_count || 0} comments</span>
        </div>

        {post.post_type && (
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
            {post.post_type}
          </span>
        )}
      </div>
    </div>
  );
};

export default PostCard;