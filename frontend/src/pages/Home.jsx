import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import PostCard from '../components/post/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import BottomNav from '../components/ui/BottomNav';
import { getAllPosts, clapPost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { staggerFadeIn } from '../utils/gsap';

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const postsRef = useRef(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (posts.length > 0 && postsRef.current) {
            const postElements = postsRef.current.querySelectorAll('[data-post-card]');
            staggerFadeIn(postElements, { delay: 0.15 });
        }
    }, [posts]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await getAllPosts();
            setPosts(response.data || []);
        } catch (err) {
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handleClap = async (postUrl) => {
        try {
            await clapPost(postUrl, user.id);
            setPosts(posts.map(post =>
                post.postUrl === postUrl
                    ? { ...post, clap: (post.clap || 0) + 1 }
                    : post
            ));
        } catch (_) { }
    };

    return (
        <div className="min-h-screen pb-24">
            {/* Header */}
            <header className="sticky top-0 z-40 glass-card border-b border-gold-700/10 px-4 py-5 mb-6">
                <div className="max-w-2xl mx-auto">
                    <motion.h1
                        className="text-3xl font-display font-bold text-gold"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Tea Social
                    </motion.h1>
                    <p className="text-ivory-500/25 text-xs tracking-widest uppercase mt-1">Curated stories</p>
                </div>
            </header>

            {/* Posts Feed */}
            <div className="max-w-2xl mx-auto px-4 space-y-5" ref={postsRef}>
                {loading ? (
                    <>
                        {[...Array(3)].map((_, i) => (
                            <PostCardSkeleton key={i} />
                        ))}
                    </>
                ) : error ? (
                    <div className="glass-card p-10 text-center">
                        <p className="text-red-400/80 mb-5 text-sm">{error}</p>
                        <button onClick={fetchPosts} className="btn-outline-gold text-sm py-2 px-5">
                            Try Again
                        </button>
                    </div>
                ) : posts.length === 0 ? (
                    <motion.div
                        className="glass-card p-16 text-center"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-glass border border-gold-700/15 flex items-center justify-center">
                            <span className="text-2xl">✦</span>
                        </div>
                        <p className="text-ivory-400 text-lg font-display mb-2">No stories yet</p>
                        <p className="text-ivory-500/25 text-sm">Be the first to share something beautiful</p>
                    </motion.div>
                ) : (
                    posts.map((post, index) => (
                        <div key={post._id || index} data-post-card>
                            <PostCard post={post} onClap={handleClap} />
                        </div>
                    ))
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default Home;
