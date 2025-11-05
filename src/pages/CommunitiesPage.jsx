import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getCommunities, subscribeToCommunity, unsubscribeFromCommunity } from '../services/api';

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState({});

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const data = await getCommunities();
      setCommunities(data);
    } catch (error) {
      console.error('Failed to fetch communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (communityId) => {
    setSubscribing(prev => ({ ...prev, [communityId]: true }));
    try {
      await subscribeToCommunity(communityId);
      // Update local state
      setCommunities(communities.map(c =>
        c.id === communityId
          ? { ...c, is_subscribed: true, subscriber_count: c.subscriber_count + 1 }
          : c
      ));
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Failed to subscribe');
    } finally {
      setSubscribing(prev => ({ ...prev, [communityId]: false }));
    }
  };

  const handleUnsubscribe = async (communityId) => {
    setSubscribing(prev => ({ ...prev, [communityId]: true }));
    try {
      await unsubscribeFromCommunity(communityId);
      // Update local state
      setCommunities(communities.map(c =>
        c.id === communityId
          ? { ...c, is_subscribed: false, subscriber_count: c.subscriber_count - 1 }
          : c
      ));
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      alert('Failed to unsubscribe');
    } finally {
      setSubscribing(prev => ({ ...prev, [communityId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading communities...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Communities</h1>
          <p className="text-gray-600">Browse and subscribe to communities</p>
        </div>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
        >
          ← Home
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map(community => (
          <div
            key={community.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <Link
              to={`/communities/${community.id}`}
              className="block mb-4"
            >
              <h2 className="text-xl font-bold text-gray-900 hover:text-indigo-600 mb-2">
                r/{community.name}
              </h2>
              <p className="text-gray-600 text-sm line-clamp-3">
                {community.description}
              </p>
            </Link>

            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-500">
                {community.subscriber_count.toLocaleString()} {community.subscriber_count === 1 ? 'subscriber' : 'subscribers'}
              </div>

              {community.is_subscribed ? (
                <button
                  onClick={() => handleUnsubscribe(community.id)}
                  disabled={subscribing[community.id]}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 text-sm font-medium"
                >
                  {subscribing[community.id] ? '...' : 'Unsubscribe'}
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(community.id)}
                  disabled={subscribing[community.id]}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium"
                >
                  {subscribing[community.id] ? '...' : 'Subscribe'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {communities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No communities yet</p>
        </div>
      )}
    </div>
  );
};

export default CommunitiesPage;
