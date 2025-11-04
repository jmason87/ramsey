import { apiCall } from './index';

export const getCommunities = async () => {
  return apiCall('/communities/');
};

export const createCommunity = async (name, description) => {
  return apiCall('/communities/', {
    method: 'POST',
    body: JSON.stringify({ name, description }),
  });
};

export const updateCommunity = async (id, name, description) => {
  return apiCall(`/communities/${id}/`, {
    method: 'PUT',
    body: JSON.stringify({ name, description }),
  });
};

export const deleteCommunity = async (id) => {
  return apiCall(`/communities/${id}/`, {
    method: 'DELETE',
  });
};