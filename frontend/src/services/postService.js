import api from './api';

export const getAllPosts = async (page = 1, limit = 10) => {
    const response = await api.get('/posts/', { params: { page, limit } });
    return response.data;
};

export const getPostByUrl = async (postUrl) => {
    const response = await api.get(`/posts/post?url=${postUrl}`);
    return response.data;
};

export const getUserPosts = async (userId) => {
    const response = await api.get('/posts/all-posts', { params: { userId } });
    return response.data;
};

export const getRecommendedPosts = async (lat, lng, page = 1, limit = 10) => {
    const response = await api.get('/posts/recommended', { params: { lat, lng, page, limit } });
    return response.data;
};

export const createPost = async (postData) => {
    const response = await api.post('/posts/create-post', postData);
    return response.data;
};

export const clapPost = async (postId, userId) => {
    const response = await api.post(`/posts/${postId}`, { userId });
    return response.data;
};

export const deletePost = async (postId) => {
    const response = await api.post('/posts/delete-post', { id: postId });
    return response.data;
};
