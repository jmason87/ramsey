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

const PostCard = ({ post }) => {
  const contentPreview = post.content?.length > 200 
    ? post.content.substring(0, 200) + '...' 
    : post.content;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 mb-4">
      {/* Header: Community and timestamp */}
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <span className="font-semibold text-indigo-600">
          r/{post.community?.name || 'Unknown'}
        </span>
        <span className="mx-2">•</span>
        <span>Posted by u/{post.user?.username || 'Anonymous'}</span>
        <span className="mx-2">•</span>
        <span>{formatDate(post.created_at)}</span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-indigo-600 cursor-pointer">
        {post.title}
      </h3>

      {/* Content Preview */}
      <p className="text-gray-700 mb-4 whitespace-pre-line">
        {contentPreview}
      </p>

      {/* Footer: Vote count, comments, post type */}
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          <span className="font-medium">{post.vote_count || 0}</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
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