import { apiCall } from './index';

export const getPosts = async () => {
  return apiCall('/posts/');
};

export const createPost = async (communityId, title, content, postType) => {
  return apiCall('/posts/', {
    method: 'POST',
    body: JSON.stringify({ 
      community_id: communityId,
      title, 
      content, 
      post_type: postType 
    }),
  });
};

export const updatePost = async (postId, title, content, postType) => {
  return apiCall(`/posts/${postId}/`, {
    method: 'PUT',
    body: JSON.stringify({ 
      title, 
      content, 
      post_type: postType 
    }),
  });
};

export const deletePost = async (postId) => {
  return apiCall(`/posts/${postId}/`, {
    method: 'DELETE',
  });
};