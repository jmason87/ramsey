import { useState } from 'react';
import { createCommunity } from '../../services/api';

const CreateCommunityModal = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await createCommunity(name, description);
            setLoading(false);
            onSuccess(); // Call parent's callback
            onClose();   // Close modal
            // Reset form
            setName('');
            setDescription('');
        } catch (err) {
            setLoading(false);
            setError(err.message || 'Failed to create community');
        }
  };

  if (!isOpen) return null;

  return (
    <div 
    className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    onClick={onClose}
    >
        <div 
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Create Community
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-800">{error}</div>
                </div>
            )}
            
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Community Name
                </label>
                <input
                    id="name"
                    type="text"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Minneapolis Tech"
                />
            </div>
            
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    id="description"
                    required
                    maxLength={255}
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Brief description of your community"
                />
            </div>
            
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
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </div>
            </form>
        </div>
    </div>

  )
};

export default CreateCommunityModal;