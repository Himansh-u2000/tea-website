import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiLogout } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/post/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import BottomNav from '../components/ui/BottomNav';
import { getAllPosts } from '../services/postService';

const Profile = () => {
    const { user, logout } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await getAllPosts();
                const userPosts = (response.data || []).filter(p => p.createdBy?._id === user?.id || p.createdBy === user?.id);
                setPosts(userPosts);
            } catch (_) { }
            finally { setLoading(false); }
        };
        fetchUserPosts();
    }, [user]);

    const stats = [
        { label: 'Posts', value: posts.length },
        { label: 'Claps', value: posts.reduce((sum, p) => sum + (p.clap || 0), 0) },
    ];

    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-card border-b border-gold-700/10 px-4 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-display font-bold text-gold">Profile</h1>
                    <button onClick={logout} className="flex items-center gap-2 text-sm text-ivory-500/30 hover:text-red-400 transition-colors">
                        <HiLogout className="w-4 h-4" /> Logout
                    </button>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 mt-6 space-y-6">
                {/* Profile Card */}
                <motion.div
                    className="glass-card p-8 text-center"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-luxury flex items-center justify-center text-obsidian-400 text-2xl font-display font-bold shadow-gold mb-4">
                        {user?.username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <h2 className="text-xl font-display font-semibold text-ivory-100 mb-1">{user?.username || 'Unknown'}</h2>
                    <p className="text-ivory-500/25 text-sm mb-6">{user?.email}</p>

                    <div className="flex justify-center gap-8">
                        {stats.map(stat => (
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl font-bold text-gold-500">{stat.value}</p>
                                <p className="text-xs text-ivory-500/25 uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* User Posts */}
                <div>
                    <h3 className="text-sm uppercase tracking-widest text-ivory-500/25 mb-4 px-1">Your Posts</h3>
                    <div className="space-y-4">
                        {loading ? (
                            [...Array(2)].map((_, i) => <PostCardSkeleton key={i} />)
                        ) : posts.length === 0 ? (
                            <div className="glass-card p-12 text-center">
                                <p className="text-ivory-500/30 text-sm">No posts yet. Start creating!</p>
                            </div>
                        ) : (
                            posts.map((post, i) => (
                                <div key={post._id || i} data-post-card>
                                    <PostCard post={post} />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default Profile;
