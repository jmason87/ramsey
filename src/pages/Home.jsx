import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCommunities, getPosts } from '../services/api';
import CreateCommunityModal from '../components/communities/CreateCommunityModal';
import CommunityList from '../components/communities/CommunityList';
import PostCard from '../components/posts/PostCard';
import EditCommunityModal from '../components/communities/EditCommunityModal';

const Home = () => {
  const { logout, user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [communityToEdit, setCommunityToEdit] = useState(null);

  const handleEditCommunity = (community) => {
    setCommunityToEdit(community);
    setIsEditModalOpen(true);
  };

  const handleCommunityUpdated = () => {
    console.log('Community updated successfully!');
    fetchCommunities();
  };

  const handleCommunityDeleted = () => {
    console.log('Community deleted successfully!');
    fetchCommunities();
  };

  const fetchCommunities = async () => {
    try {
      const data = await getCommunities();
      setCommunities(data);
    } catch (error) {
      console.error('Failed to fetch communities:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchCommunities(), fetchPosts()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array = run once on mount

  const handleCommunityCreated = () => {
    console.log('Community created successfully!');
    fetchCommunities(); // Refresh the list
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Ramsey App</h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Welcome, {user?.username || 'User'}!
              </span>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 mr-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create Community
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Post Feed */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Feed</h2>
              {posts.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-600">
                    No posts yet. Create a community and start posting!
                  </p>
                </div>
              ) : (
                <div>
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Community Sidebar */}
            <div className="lg:col-span-1">
              <CommunityList 
                communities={communities} 
                loading={false}
                onEdit={handleEditCommunity}
                onDelete={handleCommunityDeleted}
                currentUserId={user?.id}
              />            
            </div>
          </div>
        )}
      </main>
      <CreateCommunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCommunityCreated}
      />
      <EditCommunityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleCommunityUpdated}
        community={communityToEdit}
      />
    </div>
  );
};

export default Home;
