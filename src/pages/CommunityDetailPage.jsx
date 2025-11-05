import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { getCommunities, getPosts, subscribeToCommunity, unsubscribeFromCommunity } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PostCard from '../components/posts/PostCard';

const CommunityDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch all communities to find this one (could be optimized with a single endpoint)
      const allCommunities = await getCommunities();
      const foundCommunity = allCommunities.find(c => c.id === parseInt(id));
      setCommunity(foundCommunity);

      // Fetch all posts and filter by community
      const allPosts = await getPosts();
      const communityPosts = allPosts.filter(p => p.community.id === parseInt(id));
      setPosts(communityPosts);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      await subscribeToCommunity(community.id);
      setCommunity({
        ...community,
        is_subscribed: true,
        subscriber_count: community.subscriber_count + 1
      });
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  const handleUnsubscribe = async () => {
    setSubscribing(true);
    try {
      await unsubscribeFromCommunity(community.id);
      setCommunity({
        ...community,
        is_subscribed: false,
        subscriber_count: community.subscriber_count - 1
      });
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      alert('Failed to unsubscribe');
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Community not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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

      {/* Community Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              r/{community.name}
            </h1>
            <p className="text-gray-600 mb-4">{community.description}</p>
            <div className="text-sm text-gray-500">
              {community.subscriber_count.toLocaleString()} {community.subscriber_count === 1 ? 'subscriber' : 'subscribers'}
            </div>
          </div>

          <div>
            {community.is_subscribed ? (
              <button
                onClick={handleUnsubscribe}
                disabled={subscribing}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 font-medium"
              >
                {subscribing ? 'Unsubscribing...' : 'Unsubscribe'}
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium"
              >
                {subscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Posts</h2>
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={user?.id}
              onEdit={() => {}}
              onDelete={fetchData}
            />
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No posts in this community yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetailPage;
