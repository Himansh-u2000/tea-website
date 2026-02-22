import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader text="Loading..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Role-based routing
    if (user?.gender === 'female' && user?.status !== 'verified') {
        const isCurrentlyVerifyPath = window.location.pathname === '/verify-gender';
        if (!isCurrentlyVerifyPath) {
            return <Navigate to="/verify-gender" replace />;
        }
    }

    if (user?.gender === 'male') {
        const hasActiveSub = user?.subscription?.isActive;
        const isCurrentlySubscribePath = window.location.pathname === '/subscribe';
        const isCurrentlyCompletePath = window.location.pathname === '/complete';

        if (!hasActiveSub && !isCurrentlySubscribePath && !isCurrentlyCompletePath) {
            return <Navigate to="/subscribe" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
