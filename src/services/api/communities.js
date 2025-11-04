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