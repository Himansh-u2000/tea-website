import api from './api';

export const login = async ({ email, password }) => {
    const response = await api.post('/user/login', { email, password });
    return response.data;
};

export const signup = async (signupData) => {
    const { fullName, email, username, password, gender, lat, lng } = signupData;
    const response = await api.post('/user/create-user', {
        fullName,
        email,
        username,
        password,
        gender,
        lat,
        lng,
    });
    return response.data;
};

// Get current user (decode from token or fetch from user endpoint)
export const getCurrentUser = async () => {
    // For now, decode user from token or fetch from localStorage
    // In production, you'd want a /user/me endpoint
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
        // Parse JWT token to get user info (basic decode without verification)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload._id,
            email: payload.email,
            username: payload.username,
        };
    } catch (error) {
        return null;
    }
};

export const uploadGovernmentID = async (file, idType, idNumber) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idType', idType);
    formData.append('idNumber', idNumber);

    const response = await api.post('/user/upload-id', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getVerificationStatus = async () => {
    const response = await api.get('/user/verification-status');
    return response.data;
};
