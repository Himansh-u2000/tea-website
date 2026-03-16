import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PostCard from '../components/post/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import BottomNav from '../components/ui/BottomNav';
import { getAllPosts, clapPost } from '../services/postService';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const { scrollY } = useScroll();

    // Parallax for header orbs
    const orb1Y = useTransform(scrollY, [0, 300], [0, -60]);
    const orb2Y = useTransform(scrollY, [0, 300], [0, -30]);
    const headerOpacity = useTransform(scrollY, [0, 200], [1, 0]);
    const headerScale = useTransform(scrollY, [0, 200], [1, 0.95]);

    const sentinelRef = useRef(null);

    const fetchPosts = useCallback(async (pageNum) => {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const response = await getAllPosts(pageNum);
            const { posts: newPosts, hasMore: more } = response.data;

            setPosts(prev =>
                pageNum === 1
                    ? newPosts
                    : [...prev, ...newPosts.filter(p => !prev.some(e => e._id === p._id))]
            );
            setHasMore(more);
        } catch (error) {
            console.error('Error fetching posts:', error);
            if (pageNum === 1) setPosts([]);
            setHasMore(false);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    // Infinite scroll observer
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, loadingMore, loading]);

    // Fetch when page changes (after initial)
    useEffect(() => {
        if (page > 1) fetchPosts(page);
    }, [page, fetchPosts]);

    const handleClap = async (postId) => {
        try {
            await clapPost(postId, user?.id || user?._id);
            setPosts(posts.map(p => p._id === postId ? { ...p, clap: (p.clap || 0) + 1 } : p));
        } catch (error) {
            console.log('Clap error:', error);
        }
    };

    return (
        <div className="min-h-screen pb-28 relative">
            {/* Parallax Header */}
            <motion.header
                className="relative pt-14 pb-8 px-5 overflow-hidden"
                style={{ opacity: headerOpacity, scale: headerScale }}
            >
                {/* Floating orbs with parallax */}
                <motion.div
                    className="orb orb-accent w-40 h-40 -top-10 right-0"
                    style={{ y: orb1Y }}
                />
                <motion.div
                    className="orb orb-warm w-56 h-56 -bottom-20 -left-20"
                    style={{ y: orb2Y }}
                />

                <div className="relative z-10 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-display font-bold text-white mb-1">
                            Hey {user?.username || 'bestie'} 👋
                        </h1>
                        <p className="text-muted text-sm">
                            What's the tea today? ☕
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Feed */}
            <div className="max-w-2xl mx-auto px-4 space-y-4">
                {loading ? (
                    [...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)
                ) : posts.length === 0 ? (
                    <motion.div
                        className="glass-card p-12 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <span className="text-4xl block mb-3">🫖</span>
                        <p className="text-white font-medium mb-1">No gossip yet</p>
                        <p className="text-muted text-sm">Be the first to spill the tea!</p>
                    </motion.div>
                ) : (
                    <>
                        {posts.map((post, index) => (
                            <motion.div
                                key={post._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.3 }}
                            >
                                <PostCard post={post} onClap={handleClap} />
                            </motion.div>
                        ))}

                        {/* Loading more indicator */}
                        {loadingMore && (
                            <div className="py-4">
                                <PostCardSkeleton />
                            </div>
                        )}

                        {/* Sentinel for IntersectionObserver */}
                        {hasMore && <div ref={sentinelRef} className="h-10" />}

                        {/* End of feed */}
                        {!hasMore && posts.length > 0 && (
                            <div className="py-8 text-center text-gray-500 text-sm">
                                You're all caught up ☕✨
                            </div>
                        )}
                    </>
                )}
            </div>

            <BottomNav />
        </div>
    );
};

export default Home;
