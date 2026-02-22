import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiX, HiHeart, HiChat } from 'react-icons/hi';
import PostCard from '../components/post/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import BottomNav from '../components/ui/BottomNav';
import { getAllPosts, clapPost } from '../services/postService';
import { useAuth } from '../context/AuthContext';

const FindPosts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (search.trim()) {
            const q = search.toLowerCase();
            setFiltered(posts.filter(p =>
                p.title?.toLowerCase().includes(q) ||
                p.content?.toLowerCase().includes(q) ||
                p.gossip?.toLowerCase().includes(q) ||
                p.owner?.username?.toLowerCase().includes(q) ||
                p.city?.toLowerCase().includes(q)
            ));
        } else {
            setFiltered(posts);
        }
    }, [search, posts]);

    const fetchPosts = async () => {
        try {
            const response = await getAllPosts();
            setPosts(response.data || []);
        } catch (error) {
            console.error('Error:', error);
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

    const getPostImage = (post) => {
        if (post.images?.length > 0) return post.images[0];
        if (post.image) return post.image;
        if (post.thumbnail) return post.thumbnail;
        return null;
    };

    return (
        <div className="min-h-screen pb-28">
            {/* Sticky search header */}
            <header className="sticky top-0 z-40 px-4 py-3"
                style={{
                    background: 'rgba(10, 10, 11, 0.85)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid #2a2a2e',
                }}
            >
                <div className="max-w-2xl mx-auto">
                    <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                        <HiSearch className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${searchFocused ? 'text-accent' : 'text-muted'}`} />
                        <input
                            type="text"
                            placeholder="Search gossip, people, places..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className="input-dark py-2.5 pl-10 pr-10 text-sm"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                            >
                                <HiX className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-2 py-3">
                {loading ? (
                    <div className="grid grid-cols-3 gap-0.5">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="skeleton aspect-square rounded-sm" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div
                        className="px-4 py-20 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <span className="text-3xl block mb-3">🔍</span>
                        <p className="text-white font-medium mb-1">
                            {search ? 'No results found' : 'No gossip yet'}
                        </p>
                        <p className="text-muted text-sm">
                            {search ? 'Try different keywords' : 'Be the first to post!'}
                        </p>
                    </motion.div>
                ) : (
                    /* Instagram Explore Grid */
                    <div className="grid grid-cols-3 gap-0.5">
                        {filtered.map((post, i) => {
                            const img = getPostImage(post);
                            return (
                                <motion.button
                                    key={post._id || i}
                                    className="relative aspect-square overflow-hidden bg-dark-200 group"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    onClick={() => setSelectedPost(post)}
                                >
                                    {img ? (
                                        <img
                                            src={img}
                                            alt={post.title || ''}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-dark-100 p-2">
                                            <p className="text-[10px] text-muted text-center line-clamp-3 leading-tight">
                                                {post.title || post.content || post.gossip || '☕'}
                                            </p>
                                        </div>
                                    )}
                                    {/* Hover overlay with stats */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-4">
                                        <div className="flex items-center gap-1 text-white text-sm font-semibold">
                                            <HiHeart className="w-4 h-4" />
                                            <span>{post.clap || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-white text-sm font-semibold">
                                            <HiChat className="w-4 h-4" />
                                            <span>{post.comments?.length || 0}</span>
                                        </div>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Post Detail Modal — opens when grid item clicked */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/80"
                            onClick={() => setSelectedPost(null)}
                        />

                        {/* Post card */}
                        <motion.div
                            className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto no-scrollbar z-10"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-dark-200/80 flex items-center justify-center text-white hover:bg-dark-100 transition-colors"
                            >
                                <HiX className="w-4 h-4" />
                            </button>
                            <PostCard post={selectedPost} onClap={handleClap} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNav />
        </div>
    );
};

export default FindPosts;
