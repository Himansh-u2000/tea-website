import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { HiHeart, HiOutlineHeart, HiOutlineChat, HiOutlineShare } from 'react-icons/hi';
import { formatDate } from '../../utils/formatters';
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
            className="relative bg-dark-200 rounded-2xl overflow-hidden border border-gray-800"
            onDoubleClick={onDoubleTap}
        >
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                    {images.map((src, i) => (
                        <div key={i} className="flex-[0_0_100%] min-w-0">
                            <img
                                src={src}
                                alt={title || `Image ${i + 1}`}
                                className="w-full aspect-[4/3] object-cover"
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
                                onClick={(e) => { e.stopPropagation(); emblaApi?.scrollTo(i); }}
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

    const handleClap = (e) => {
        if (e) e.stopPropagation();
        if (hasClappedLocal) return; // Lock multiple likes
        setHasClappedLocal(true);
        setClapAnim(true);
        setShowBigHeart(true);
        setTimeout(() => setClapAnim(false), 600);
        setTimeout(() => setShowBigHeart(false), 1000);
        onClap?.(post._id);
        setLocalClaps(prev => prev + 1);
    };

    const handleShare = async (e) => {
        e.stopPropagation();
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

    const images = (post.images || (post.image ? [post.image] : [])).filter(Boolean);
    const content = post.gossip || post.content || '';

    return (
        <motion.article
            className="bg-black border-b border-gray-800 pb-3 pt-3 px-4 cursor-pointer hover:bg-dark-200/20 transition-colors"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsDetailModalOpen(true)}
        >
            <div className="flex gap-3">
                {/* Left Column: Avatar */}
                <div className="shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {(post.createdBy?.username || post.owner?.username || post.author || '?')[0]?.toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* Right Column: Content */}
                <div className="flex-1 min-w-0 relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-0.5 mt-0.5">
                        <div className="flex flex-wrap items-center gap-x-1.5 text-[15px] leading-tight">
                            <span className="font-bold text-white hover:underline truncate max-w-[120px]">
                                {post.createdBy?.username || post.owner?.username || post.author || 'Anonymous'}
                            </span>
                            <span className="text-gray-500 text-sm truncate max-w-[100px]">
                                @{post.createdBy?.username || post.owner?.username || post.author || 'anonymous'}
                            </span>
                            <span className="text-gray-500 text-sm">·</span>
                            <span className="text-gray-500 text-sm whitespace-nowrap">
                                {formatDate(post.createdAt)}
                            </span>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-[15px] text-white leading-normal whitespace-pre-wrap mb-3 mt-1 pr-2">
                        {post.title && <p className="font-semibold mb-1 text-[16px]">{post.title}</p>}
                        {content && (
                            <div className={expanded ? '' : 'line-clamp-4 text-gray-200'} style={{ wordBreak: 'break-word' }}>
                                {content}
                            </div>
                        )}
                        {content && content.length > 200 && (
                            <button
                                onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                                className="text-accent hover:underline text-sm mt-1"
                            >
                                {expanded ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </div>

                    {/* Media */}
                    {images.length > 0 && (
                        <div className="mb-3 pr-4" onClick={(e) => e.stopPropagation()}>
                            <ImageCarousel images={images} title={post.title} onDoubleTap={handleClap} />
                        </div>
                    )}

                    {/* Actions Bar */}
                    <div className="flex items-center justify-between text-gray-500 max-w-md pr-6 mt-1 -ml-2">
                        {/* Clap / Like */}
                        <button
                            onClick={handleClap}
                            className={`group flex items-center gap-1.5 transition-colors ${hasClappedLocal || clapAnim ? 'text-pink-500' : 'hover:text-pink-500'}`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors relative">
                                <motion.div animate={clapAnim ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
                                    {hasClappedLocal || clapAnim ? (
                                        <HiHeart className="w-[18px] h-[18px]" />
                                    ) : (
                                        <HiOutlineHeart className="w-[18px] h-[18px]" />
                                    )}
                                </motion.div>

                                <AnimatePresence>
                                    {showBigHeart && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 2, opacity: 1, y: -20 }}
                                            exit={{ scale: 3, opacity: 0 }}
                                            className="absolute inset-0 pointer-events-none text-pink-500 flex items-center justify-center -top-4"
                                        >
                                            <HiHeart className="w-6 h-6" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <span className="text-[13px]">{localClaps > 0 ? localClaps : ''}</span>
                        </button>

                        {/* Reply / Chat */}
                        <div className="group flex items-center gap-1.5 hover:text-blue-400 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                                <HiOutlineChat className="w-[18px] h-[18px]" />
                            </div>
                            <span className="text-[13px]">{post.comments?.length > 0 ? post.comments.length : ''}</span>
                        </div>

                        {/* Share / Retweet-ish */}
                        <button onClick={handleShare} className="group flex items-center gap-1.5 hover:text-green-400 transition-colors">
                            <div className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
                                <HiOutlineShare className="w-[18px] h-[18px]" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <PostDetailModal
                post={post}
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
            />
        </motion.article>
    );
};

export default PostCard;
