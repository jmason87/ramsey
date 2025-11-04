import { apiCall } from './index';

export const getPosts = async () => {
  return apiCall('/posts/');
};