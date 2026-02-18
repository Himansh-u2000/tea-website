import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSearch } from 'react-icons/hi';
import PostCard from '../components/post/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import BottomNav from '../components/ui/BottomNav';
import { getAllPosts, clapPost } from '../services/postService';
import { useAuth } from '../context/AuthContext';

const FindPosts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await getAllPosts();
                setPosts(response.data || []);
                setFilteredPosts(response.data || []);
            } catch (_) { }
            finally { setLoading(false); }
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredPosts(posts);
        } else {
            const q = searchTerm.toLowerCase();
            setFilteredPosts(posts.filter(p =>
                p.title?.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q)
            ));
        }
    }, [searchTerm, posts]);

    const handleClap = async (postUrl) => {
        try {
            await clapPost(postUrl, user.id);
            setPosts(posts.map(p => p.postUrl === postUrl ? { ...p, clap: (p.clap || 0) + 1 } : p));
        } catch (_) { }
    };

    return (
        <div className="min-h-screen pb-24">
            <header className="sticky top-0 z-40 glass-card border-b border-gold-700/10 px-4 py-4 mb-6">
                <div className="max-w-2xl mx-auto space-y-3">
                    <h1 className="text-xl font-display font-bold text-gold">Discover</h1>
                    <div className="relative">
                        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gold-600/40 w-4 h-4" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search stories..."
                            className="input-field pl-11 text-sm"
                        />
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 space-y-5">
                {loading ? (
                    [...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)
                ) : filteredPosts.length === 0 ? (
                    <motion.div className="glass-card p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p className="text-ivory-500/30 text-sm">
                            {searchTerm ? 'No stories match your search' : 'No stories to discover yet'}
                        </p>
                    </motion.div>
                ) : (
                    filteredPosts.map((post, index) => (
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

export default FindPosts;
