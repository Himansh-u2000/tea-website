import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';
import { HiCheckCircle } from 'react-icons/hi';
import { verifyCheckoutSession } from '../services/paymentService';

const Complete = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { refreshSession } = useAuth();
    const [status, setStatus] = useState('processing');

    useEffect(() => {
        const verifyPaymentAndRefresh = async () => {
            const sessionId = searchParams.get('session_id');
            if (!sessionId) {
                navigate('/');
                return;
            }

            try {
                await verifyCheckoutSession(sessionId);
                await refreshSession();
                setStatus('success');

                // Redirect to home after a brief success message
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } catch (error) {
                console.error("Failed to refresh session after payment", error);
                navigate('/');
            }
        };

        verifyPaymentAndRefresh();
    }, [navigate, refreshSession, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                className="text-center p-8 glass-card-elevated rounded-3xl max-w-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {status === 'processing' ? (
                    <>
                        <Loader text="Verifying your payment..." />
                        <p className="mt-4 text-muted text-sm">Please do not close this window.</p>
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center"
                    >
                        <HiCheckCircle className="w-20 h-20 text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                        <p className="text-gray-400 text-sm">Welcome to Premium Tea. Redirecting to your feed...</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default Complete;
