import api from './api';

// Add a comment to a post
export const addComment = async (postId, text) => {
    const response = await api.post(`/post/${postId}/comment`, { text });
    return response.data;
};

// Get comments for a post
export const getComments = async (postId) => {
    const response = await api.get(`/post/${postId}/comments`);
    return response.data;
};

// Like a comment
export const likeComment = async (commentId) => {
    const response = await api.post(`/comment/${commentId}/like`);
    return response.data;
};
