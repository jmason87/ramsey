import { apiCall } from './index';

export const getComments = async (postId) => {
  return apiCall(`/posts/${postId}/comments/`);
};

export const createComment = async (postId, content) => {
  return apiCall('/comments/', {
    method: 'POST',
    body: JSON.stringify({ post: postId, content }),
  });
};

export const updateComment = async (commentId, content) => {
  return apiCall(`/comments/${commentId}/`, {
    method: 'PUT',
    body: JSON.stringify({ content }),
  });
};

export const deleteComment = async (commentId) => {
  return apiCall(`/comments/${commentId}/`, {
    method: 'DELETE',
  });
};
