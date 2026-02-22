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

export const getCurrentUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
        const response = await api.get('/user/me');
        return response.data.data;
    } catch (error) {
        return null;
    }
};

export const submitVerification = async ({ idType, idNumber, imageUrl }) => {
    const response = await api.post('/user/upload-id', {
        idType,
        idNumber,
        imageUrl,
    });
    return response.data;
};

export const getVerificationStatus = async () => {
    const response = await api.get('/user/verification-status');
    return response.data;
};

export const googleLogin = async (code, lat, lng) => {
    const response = await api.post(`/user/oauth-login?code=${code}&lat=${lat || ''}&lng=${lng || ''}`);
    return response.data;
};
