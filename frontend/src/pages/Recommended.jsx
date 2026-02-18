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

    const handleClap = async (postUrl) => {
        try {
            await clapPost(postUrl, user.id);
            setPosts(posts.map(p => p.postUrl === postUrl ? { ...p, clap: (p.clap || 0) + 1 } : p));
        } catch (_) { }
    };

    return (
        <div className="min-h-screen pb-24">
            <header className="sticky top-0 z-40 glass-card border-b border-gold-700/10 px-4 py-4 mb-6">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-xl font-display font-bold text-gold">Nearby</h1>
                    <p className="text-ivory-500/25 text-xs tracking-widest uppercase mt-1">Stories around you</p>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4">
                {!locationGranted ? (
                    <motion.div
                        className="glass-card p-12 text-center"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-glass border border-gold-700/15 flex items-center justify-center">
                            <HiLocationMarker className="w-7 h-7 text-gold-500" />
                        </div>
                        <h2 className="text-lg font-display font-semibold text-ivory-200 mb-2">Discover Nearby</h2>
                        <p className="text-ivory-500/30 text-sm mb-6 max-w-xs mx-auto">
                            Allow location access to find stories from people around you
                        </p>
                        {error && <p className="text-red-400/80 text-sm mb-4">{error}</p>}
                        <Button variant="primary" onClick={handleRequestLocation} loading={loading}>
                            Enable Location
                        </Button>
                    </motion.div>
                ) : (
                    <div className="space-y-5">
                        {loading ? (
                            [...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)
                        ) : posts.length === 0 ? (
                            <div className="glass-card p-12 text-center">
                                <p className="text-ivory-500/30 text-sm">No stories found nearby</p>
                            </div>
                        ) : (
                            posts.map((post, i) => (
                                <div key={post._id || i} data-post-card>
                                    <PostCard post={post} onClap={handleClap} />
                                </div>
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
