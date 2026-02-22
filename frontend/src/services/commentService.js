import api from './api';

// Fetch all comments for a post
export const getComments = async (postId) => {
    const response = await api.get(`/comment/${postId}`);
    return response.data;
};

// Add a top-level comment to a post
export const addComment = async (postId, content, userId) => {
    const response = await api.post(`/comment`, { postId, content, userId });
    return response.data;
};

// Reply to a specific comment
export const addReply = async (commentId, content, userId) => {
    const response = await api.post(`/comment/reply`, { commentId, content, userId });
    return response.data;
};

// Like/Clap a comment
export const likeComment = async (commentId, userId) => {
    const response = await api.post(`/comment/clap`, { commentId, userId });
    return response.data;
};
