import { useState } from 'react';
import { deleteCommunity } from '../../services/api';

const CommunityList = ({ communities, loading, onEdit, onDelete, currentUserId }) => {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (community) => {
    if (!window.confirm(`Are you sure you want to delete "${community.name}"?`)) {
      return;
    }

    setDeleting(community.id);
    try {
      await deleteCommunity(community.id);
      onDelete(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete community:', error);
      alert('Failed to delete community');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Communities</h2>
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!communities || communities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Communities</h2>
        <p className="text-gray-600 text-sm">No communities yet. Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Communities</h2>
      <div className="space-y-3">
        {communities.map((community) => {
          // Debug logging with types
          console.log('Community:', community.name, 
            'Creator:', community.creator, typeof community.creator,
            'CurrentUser:', currentUserId, typeof currentUserId,
            'Match:', community.creator === currentUserId);
          
          return (
            <div
              key={community.id}
              className="p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 cursor-pointer">
                  <p className="font-medium text-gray-900">r/{community.name}</p>
                  <p className="text-sm text-gray-600 truncate">{community.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {community.subscriber_count} members
                  </p>
                </div>
                
                {/* Show edit/delete only if user is creator */}
                {Number(community.creator) === Number(currentUserId) && (
                <div className="flex space-x-2 ml-2">
                  <button
                    onClick={() => onEdit(community)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                    title="Edit community"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(community)}
                    disabled={deleting === community.id}
                    className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    title="Delete community"
                  >
                    {deleting === community.id ? (
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
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommunityList;