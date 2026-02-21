import api from './api';

export const createCheckoutSession = async (userId, productId) => {
    try {
        const response = await api.post('/subscription/create-checkout-session', {
            userId,
            productId
        });
        return response.data;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};
