import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getPosts, getComments, createComment, deleteComment } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { votePost, removeVote } from '../services/api';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const PostDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch all posts and find this one
      const allPosts = await getPosts();
      const foundPost = allPosts.find(p => p.id === parseInt(id));
      setPost(foundPost);
      setVoteCount(foundPost?.vote_count || 0);
      setUserVote(foundPost?.user_vote || null);

      // Fetch comments for this post
      const postComments = await getComments(id);
      setComments(postComments);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      await createComment(id, commentText);
      setCommentText('');
      // Refresh comments
      const postComments = await getComments(id);
      setComments(postComments);
    } catch (error) {
      console.error('Failed to create comment:', error);
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment');
    }
  };

  const handleVote = async (voteValue) => {
    if (voting) return;

    const previousVote = userVote;
    const previousCount = voteCount;

    let newVote = null;
    let newCount = voteCount;

    if (previousVote === voteValue) {
      newVote = null;
      newCount = voteCount - voteValue;
    } else if (previousVote === null) {
      newVote = voteValue;
      newCount = voteCount + voteValue;
    } else {
      newVote = voteValue;
      newCount = voteCount + (voteValue - previousVote);
    }

    setUserVote(newVote);
    setVoteCount(newCount);
    setVoting(true);

    try {
      if (newVote === null) {
        await removeVote(id);
      } else {
        await votePost(id, voteValue);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      setUserVote(previousVote);
      setVoteCount(previousCount);
      alert('Failed to register vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Post not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back to Home Button */}
      <div className="mb-4">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Post */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {/* Post Header */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Link
            to={`/communities/${post.community.id}`}
            className="font-semibold text-indigo-600 hover:text-indigo-800"
          >
            r/{post.community.name}
          </Link>
          <span className="mx-2">•</span>
          <span>Posted by u/{post.user.username}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(post.created_at)}</span>
        </div>

        {/* Post Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Post Content */}
        <div className="text-gray-700 mb-6 whitespace-pre-line">
          {post.content}
        </div>

        {/* Post Footer */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 pt-4 border-t">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleVote(1)}
              disabled={voting}
              className={`transition-colors ${
                userVote === 1 
                  ? 'text-orange-500' 
                  : 'text-gray-400 hover:text-orange-500'
              } disabled:opacity-50`}
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
            <span>{comments.length} comments</span>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSubmitComment}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows="4"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </form>
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Comments ({comments.length})
        </h2>
        {comments.map(comment => (
          <div key={comment.id} className="bg-white rounded-lg shadow p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium">u/{comment.user?.username || 'Anonymous'}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(comment.created_at)}</span>
              </div>
              {Number(comment.user?.id) === Number(user?.id) && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
            <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetailPage;
