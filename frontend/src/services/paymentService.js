import api from './api';

export const createCheckoutSession = async (userId, priceId) => {
    console.log("userId", userId, "priceId", priceId)
    try {
        const response = await api.post('/subscription/create-checkout-session', {
            userId,
            priceId
        });
        return response.data;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};

export const verifyCheckoutSession = async (sessionId) => {
    try {
        const response = await api.post('/subscription/verify-session', {
            sessionId
        });
        return response.data;
    } catch (error) {
        console.error('Error verifying checkout session:', error);
        throw error;
    }
};
