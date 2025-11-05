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

export const subscribeToCommunity = async (id) => {
  return apiCall(`/communities/${id}/subscribe/`, {
    method: 'POST',
  });
};

export const unsubscribeFromCommunity = async (id) => {
  return apiCall(`/communities/${id}/unsubscribe/`, {
    method: 'DELETE',
  });
};