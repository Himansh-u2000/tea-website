import api from './api';

export const getAllPosts = async () => {
    const response = await api.get('/posts/');
    return response.data;
};

export const getPostByUrl = async (postUrl) => {
    const response = await api.get(`/posts/post?url=${postUrl}`);
    return response.data;
};

export const getUserPosts = async (userId) => {
    const response = await api.get('/posts/all-posts', {
        data: { userId },
    });
    return response.data;
};

export const getRecommendedPosts = async (lat, lng) => {
    const response = await api.get('/posts/recommended', {
        data: { lat, lng },
    });
    return response.data;
};

export const createPost = async (postData) => {
    const response = await api.post('/posts/create-post', postData);
    return response.data;
};

export const clapPost = async (postUrl, userId) => {
    const response = await api.post(`/posts/${postUrl}`, { userId });
    return response.data;
};

export const deletePost = async (postId) => {
    const response = await api.post('/posts/delete-post', { id: postId });
    return response.data;
};
