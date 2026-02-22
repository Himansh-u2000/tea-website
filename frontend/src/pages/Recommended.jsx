import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLocationMarker } from 'react-icons/hi';
import PostCard from '../components/post/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import BottomNav from '../components/ui/BottomNav';
import Button from '../components/ui/Button';
import { getRecommendedPosts, clapPost } from '../services/postService';
import { getCurrentPosition } from '../utils/geolocation';
import { useAuth } from '../context/AuthContext';

const Recommended = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationGranted, setLocationGranted] = useState(false);
    const [error, setError] = useState('');

    const handleRequestLocation = async () => {
        setLoading(true);
        setError('');
        try {
            const pos = await getCurrentPosition();
            setLocationGranted(true);
            const response = await getRecommendedPosts(pos.lat, pos.lng);
            setPosts(response.data || []);
        } catch (_) {
            setError('Unable to access location. Please enable location services.');
        } finally {
            setLoading(false);
        }
    };

    const handleClap = async (postId) => {
        try {
            await clapPost(postId, user?.id || user?._id);
            setPosts(posts.map(p => p._id === postId ? { ...p, clap: (p.clap || 0) + 1 } : p));
        } catch (_) { }
    };

    return (
        <div className="min-h-screen pb-28">
            <header className="sticky top-0 z-40 px-4 py-3"
                style={{
                    background: 'rgba(10, 10, 11, 0.85)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid #2a2a2e',
                }}
            >
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-lg font-display font-bold text-white">Nearby</h1>
                    <p className="text-muted text-xs">Gossip around you</p>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-6">
                {!locationGranted ? (
                    <motion.div
                        className="glass-card-elevated p-10 text-center"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <motion.div
                            className="w-16 h-16 mx-auto mb-5 rounded-full bg-dark-100 border border-dark-50 flex items-center justify-center"
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <HiLocationMarker className="w-7 h-7 text-accent" />
                        </motion.div>
                        <h2 className="text-lg font-display font-semibold text-white mb-2">Discover Nearby Tea</h2>
                        <p className="text-muted text-sm mb-5 max-w-xs mx-auto">
                            Allow location access to find gossip from people near you ☕
                        </p>
                        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
                        <Button variant="primary" onClick={handleRequestLocation} loading={loading}>
                            Enable Location
                        </Button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {loading ? (
                            [...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)
                        ) : posts.length === 0 ? (
                            <div className="glass-card p-12 text-center">
                                <span className="text-3xl block mb-3">📍</span>
                                <p className="text-muted text-sm">No gossip found nearby</p>
                            </div>
                        ) : (
                            posts.map((post, i) => (
                                <motion.div
                                    key={post._id || i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <PostCard post={post} onClap={handleClap} />
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default Recommended;
