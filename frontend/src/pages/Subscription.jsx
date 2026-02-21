import { useState } from 'react';
import { motion } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { HiCheck, HiStar } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { createCheckoutSession } from '../services/paymentService';

// Ensure correct public key is here or in .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

const Subscription = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (priceId) => {
        if (!user) return alert("Please log in to subscribe");

        try {
            setLoading(true);
            const data = await createCheckoutSession(user._id, priceId);

            // Backend returns a full Stripe checkout session object
            if (data?.data?.payment_details?.url) {
                window.location.href = data.data.payment_details.url;
            } else if (data?.data?.payment_details?.id) {
                const stripe = await stripePromise;
                await stripe.redirectToCheckout({
                    sessionId: data.data.payment_details.id
                });
            } else {
                throw new Error("Invalid session data from server");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to initialize checkout. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-24 px-4 flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-3xl p-8 shadow-2xl shadow-pink-500/10 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500" />

                <div className="mx-auto w-16 h-16 bg-pink-500/20 text-pink-500 rounded-full flex items-center justify-center mb-6">
                    <HiStar className="w-8 h-8" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-2">Premium Tea</h1>
                <p className="text-gray-400 text-sm mb-8">Unlock exclusive features and support the platform.</p>

                <div className="text-5xl font-extrabold text-white mb-8 tracking-tight">
                    $10<span className="text-lg text-gray-500 font-medium tracking-normal">/mo</span>
                </div>

                <ul className="space-y-4 text-left mb-10">
                    {['Ad-free experience', 'Premium creator badge', 'Exclusive content access', 'Priority support'].map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-300">
                            <HiCheck className="w-5 h-5 text-pink-500 mr-3 shrink-0" />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubscribe(import.meta.env.VITE_STRIPE_PRICE_ID || 'price_1234')}
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-pink-500/25 disabled:opacity-70 flex justify-center items-center"
                >
                    {loading ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Subscribe Now'
                    )}
                </motion.button>
            </motion.div>
        </div>
    );
};

export default Subscription;
