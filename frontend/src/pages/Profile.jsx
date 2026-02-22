import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiLogout, HiTrash } from 'react-icons/hi';
import PostCard from '../components/post/PostCard';
import { PostCardSkeleton, ProfileSkeleton } from '../components/ui/Skeleton';
import BottomNav from '../components/ui/BottomNav';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { getUserPosts, clapPost, deletePost } from '../services/postService';

const Profile = () => {
    const { user, logout } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { scrollY } = useScroll();

    const headerScale = useTransform(scrollY, [0, 150], [1, 0.97]);
    const headerOpacity = useTransform(scrollY, [0, 150], [1, 0.8]);

    useEffect(() => {
        if (user) fetchPosts();
    }, [user]);

    const fetchPosts = async () => {
        try {
            const response = await getUserPosts(user?.id || user?._id);
            setPosts(response.data || []);
        } catch (error) {
            console.log('Error fetching posts:', error);
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

    const handleDelete = async (postId) => {
        if (!confirm('Delete this post?')) return;
        try {
            await deletePost(postId);
            setPosts(posts.filter(p => p._id !== postId));
        } catch (error) {
            console.log('Delete error:', error);
        }
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen pb-28">
            {/* Profile Header with parallax */}
            <motion.header
                className="relative px-5 pt-12 pb-6 overflow-hidden"
                style={{ scale: headerScale, opacity: headerOpacity }}
            >
                <div className="orb orb-accent w-48 h-48 -top-16 -right-16 animate-float" />
                <div className="orb orb-warm w-32 h-32 bottom-0 left-0 animate-float-delay" />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            {/* Avatar */}
                            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                                style={{ background: 'linear-gradient(135deg, #ff6b35, #ff3d7f)' }}
                            >
                                {(user?.username || '?')[0]?.toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-xl font-display font-bold text-white">
                                    {user?.fullName || user?.username || 'User'}
                                </h1>
                                <p className="text-muted text-sm">@{user?.username || 'anonymous'}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <HiLogout className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4">
                        <div className="glass-card flex-1 py-3 text-center">
                            <motion.p
                                className="text-xl font-bold text-gradient"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {posts.length}
                            </motion.p>
                            <p className="text-muted text-xs mt-0.5">Posts</p>
                        </div>
                        <div className="glass-card flex-1 py-3 text-center">
                            <motion.p
                                className="text-xl font-bold text-gradient"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {posts.reduce((sum, p) => sum + (p.clap || 0), 0)}
                            </motion.p>
                            <p className="text-muted text-xs mt-0.5">Claps</p>
                        </div>
                        <div className="glass-card flex-1 py-3 text-center">
                            <motion.p
                                className="text-xl font-bold text-gradient"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                {user?.city || '—'}
                            </motion.p>
                            <p className="text-muted text-xs mt-0.5">City</p>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* User's posts */}
            <div className="max-w-2xl mx-auto px-4 space-y-4 mt-2">
                <h2 className="text-sm font-medium text-muted uppercase tracking-wider px-1">Your Posts</h2>

                {loading ? (
                    [...Array(2)].map((_, i) => <PostCardSkeleton key={i} />)
                ) : posts.length === 0 ? (
                    <motion.div
                        className="glass-card p-10 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <span className="text-3xl block mb-3">✨</span>
                        <p className="text-white font-medium mb-1">No posts yet</p>
                        <p className="text-muted text-sm">Time to spill some tea!</p>
                    </motion.div>
                ) : (
                    posts.map((post, i) => (
                        <motion.div
                            key={post._id || i}
                            className="relative"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <PostCard post={post} onClap={handleClap} />
                            <button
                                onClick={() => handleDelete(post._id)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-dark-200/80 flex items-center justify-center text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <HiTrash className="w-3.5 h-3.5" />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default Profile;
