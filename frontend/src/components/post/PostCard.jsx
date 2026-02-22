import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { HiLocationMarker, HiClock, HiHeart, HiChat, HiShare } from 'react-icons/hi';
import { formatDate, truncateText } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import PostDetailModal from './PostDetailModal';

/* ── Embla Image Carousel ── */
const ImageCarousel = ({ images, title, onDoubleTap }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
    const [selectedIdx, setSelectedIdx] = useState(0);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIdx(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
        onSelect();
        return () => emblaApi.off('select', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <div
            className="relative bg-black"
            onDoubleClick={onDoubleTap}
        >
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {images.map((src, i) => (
                        <div key={i} className="flex-[0_0_100%] min-w-0">
                            <img
                                src={src}
                                alt={title || `Image ${i + 1}`}
                                className="w-full aspect-[4/5] object-cover"
                                loading="lazy"
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
            {images.length > 1 && (
                <>
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-lg"
                        style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    >
                        {selectedIdx + 1}/{images.length}
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-2 py-1.5 rounded-full backdrop-blur-sm">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => emblaApi?.scrollTo(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === selectedIdx ? 'bg-pink-500 w-4' : 'bg-white/60 w-1.5 hover:bg-white'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const PostCard = ({ post, onClap }) => {
    const { user } = useAuth();
    const [clapAnim, setClapAnim] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [showBigHeart, setShowBigHeart] = useState(false);
    const [localClaps, setLocalClaps] = useState(post.clappedBy?.length || post.clap || 0);

    const [hasClappedLocal, setHasClappedLocal] = useState(() => {
        const userId = user?.id || user?._id;
        return post.clappedBy?.includes(userId) || false;
    });

    const handleClap = () => {
        if (hasClappedLocal) return; // Lock multiple likes
        setHasClappedLocal(true);
        setClapAnim(true);
        setShowBigHeart(true);
        setTimeout(() => setClapAnim(false), 600);
        setTimeout(() => setShowBigHeart(false), 1000);
        onClap?.(post._id);
        setLocalClaps(prev => prev + 1);
    };

    const handleShare = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: post.title || 'Check this out!',
                    url: `${window.location.origin}/post?url=${post.postUrl}`
                });
            } else {
                await navigator.clipboard.writeText(`${window.location.origin}/post?url=${post.postUrl}`);
                alert("Link copied to clipboard!");
            }
        } catch (error) {
            console.log("Error sharing:", error);
        }
    };

    const images = post.images || (post.image ? [post.image] : []);
    const content = post.gossip || post.content || '';

    // Mock top comment, or remove it entirely if you want all discussion inside modal
    const topComment = post.comments?.length > 0
        ? [...post.comments].sort((a, b) => (b.clappedBy?.length || 0) - (a.clappedBy?.length || 0))[0]
        : null;

    return (
        <motion.article
            className="bg-black border-b border-gray-800 overflow-hidden pb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4 }}
        >
            {/* Header — Instagram style */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-900/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 p-[2px]">
                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {(post.owner?.username || post.author || '?')[0]?.toUpperCase()}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate">
                        {post.owner?.username || post.author || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                        <span>{formatDate(post.createdAt)}</span>
                        {post.city && (
                            <>
                                <span>•</span>
                                <span>{post.city}{post.region ? `, ${post.region}` : ''}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Embla image carousel */}
            <div className="relative">
                {images.length > 0 && <ImageCarousel images={images} title={post.title} onDoubleTap={handleClap} />}

                {/* Big Heart Animation for Double Tap */}
                <AnimatePresence>
                    {showBigHeart && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0, x: '-50%', y: '-50%' }}
                            animate={{ scale: 1.2, opacity: 0.9, x: '-50%', y: '-50%' }}
                            exit={{ scale: 1.5, opacity: 0, x: '-50%', y: '-50%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute top-1/2 left-1/2 pointer-events-none drop-shadow-2xl z-10"
                        >
                            <HiHeart className="w-32 h-32 text-pink-500" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Actions — Instagram style */}
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <motion.button
                        onClick={handleClap}
                        whileTap={{ scale: 1.3 }}
                        className="flex items-center gap-1.5 group"
                    >
                        <motion.div
                            animate={clapAnim ? { scale: [1, 1.4, 1], rotate: [0, -15, 15, 0] } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <HiHeart className={`w-7 h-7 transition-colors ${hasClappedLocal || clapAnim ? 'text-pink-500' : 'text-white hover:text-gray-300'}`} />
                        </motion.div>
                    </motion.button>
                    <button onClick={() => setIsDetailModalOpen(true)} className="group hover:-translate-y-0.5 transition-transform">
                        <HiChat className="w-7 h-7 text-white hover:text-gray-300 transition-colors" />
                    </button>
                    <button onClick={handleShare} className="group hover:-translate-y-0.5 transition-transform">
                        <HiShare className="w-7 h-7 text-white hover:text-gray-300 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Likes count */}
            <div className="px-4 pb-1">
                <span className="text-white text-sm font-bold">{localClaps} likes</span>
            </div>

            {/* Content */}
            <div className="px-4 pb-2">
                {post.title && (
                    <p className="text-sm leading-relaxed">
                        <span className="font-bold text-white mr-2">{post.owner?.username || post.author || 'Anonymous'}</span>
                        <span className="text-gray-100">
                            {expanded ? (post.title + (content ? ' — ' + content : '')) : truncateText((post.title + (content ? ' — ' + content : '')), 100)}
                        </span>
                        {(post.title + (content ? ' — ' + content : '')).length > 100 && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-gray-400 font-medium text-sm ml-1 hover:text-white"
                            >
                                {expanded ? 'less' : 'more'}
                            </button>
                        )}
                    </p>
                )}
            </div>

            {/* Top comment highlight */}
            {topComment && (
                <div className="px-4 pb-2">
                    <p className="text-[12px] text-gray-500 leading-relaxed">
                        <span className="font-semibold text-gray-400">{topComment.user?.username || 'Someone'}</span>
                        {' '}
                        <span className="italic">{truncateText(topComment.text, 80)}</span>
                        {topComment.likes > 0 && (
                            <span className="ml-1.5 text-accent/60 text-[10px] font-medium">♥ {topComment.likes}</span>
                        )}
                    </p>
                </div>
            )}

            {/* View all comments link */}
            {!isDetailModalOpen && (
                <button
                    onClick={() => setIsDetailModalOpen(true)}
                    className="px-4 pb-2 text-muted text-[12px] font-medium"
                >
                    View discussions
                </button>
            )}

            {/* Fake Inline Comment Input */}
            {!isDetailModalOpen && (
                <div className="px-4 pb-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 p-[1px] shrink-0">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
                            {(user?.username || '?')[0]?.toUpperCase()}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsDetailModalOpen(true)}
                        className="flex-1 text-left text-[13px] text-gray-500 bg-transparent outline-none focus:outline-none"
                    >
                        Add a comment...
                    </button>
                </div>
            )}

            <PostDetailModal
                post={post}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
            />
        </motion.article>
    );
};

export default PostCard;
