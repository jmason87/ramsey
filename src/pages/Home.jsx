import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [count, setCount] = useState(0);
  const { logout, user } = useAuth();

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
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <div className="flex justify-center space-x-4 mb-8">
              <a
                href="https://vite.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/vite.svg"
                  className="h-24 w-24 hover:drop-shadow-lg transition-all"
                  alt="Vite logo"
                />
              </a>
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/src/assets/react.svg"
                  className="h-24 w-24 hover:drop-shadow-lg transition-all"
                  alt="React logo"
                />
              </a>
            </div>
            
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Vite + React
            </h2>
            
            <div className="bg-white rounded-lg shadow p-8 max-w-md mx-auto">
              <button
                onClick={() => setCount((count) => count + 1)}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4"
              >
                count is {count}
              </button>
              <p className="text-gray-600">
                Edit <code className="bg-gray-100 px-2 py-1 rounded text-sm">src/pages/Home.jsx</code> and save to test HMR
              </p>
            </div>
            
            <p className="text-gray-500 mt-8">
              Click on the Vite and React logos to learn more
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
