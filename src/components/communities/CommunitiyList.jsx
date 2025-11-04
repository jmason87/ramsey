const CommunityList = ({ communities, loading }) => {
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
        {communities.map((community) => (
          <div
            key={community.id}
            className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
          >
            <div>
              <p className="font-medium text-gray-900">r/{community.name}</p>
              <p className="text-sm text-gray-600 truncate">{community.description}</p>
            </div>
            <div className="text-sm text-gray-500">
              {community.subscriber_count} members
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityList;