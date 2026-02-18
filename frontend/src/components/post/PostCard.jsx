import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiClock, HiHeart } from 'react-icons/hi';
import { formatDate, truncateText } from '../../utils/formatters';

const PostCard = ({ post, onClap }) => {
    const [clapAnim, setClapAnim] = useState(false);

    const handleClap = () => {
        setClapAnim(true);
        setTimeout(() => setClapAnim(false), 600);
        if (onClap) onClap(post.postUrl);
    };

    return (
        <motion.article
            className="glass-card-hover overflow-hidden"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            {/* Image */}
            {post.thumbnail && (
                <div className="relative overflow-hidden">
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="w-full h-56 object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian-400/80 via-transparent to-transparent" />
                </div>
            )}

            <div className="p-5">
                {/* Author & Meta */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-luxury flex items-center justify-center text-obsidian-400 text-sm font-bold">
                            {post.createdBy?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <p className="text-ivory-200 text-sm font-medium">{post.createdBy?.username || 'Anonymous'}</p>
                            <div className="flex items-center gap-2 text-ivory-500/25 text-xs">
                                <HiClock className="w-3 h-3" />
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    {post.lat && (
                        <div className="flex items-center gap-1 text-gold-600/40 text-xs">
                            <HiLocationMarker className="w-3 h-3" />
                            <span>Nearby</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <h3 className="text-lg font-display font-semibold text-ivory-100 mb-2 leading-snug">{post.title}</h3>
                {post.content && (
                    <p className="text-ivory-500/40 text-sm leading-relaxed mb-4">
                        {truncateText(post.content, 120)}
                    </p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gold-700/8">
                    <motion.button
                        onClick={handleClap}
                        className="flex items-center gap-2 text-sm transition-colors"
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.div
                            animate={clapAnim ? { scale: [1, 1.4, 1], rotate: [0, -10, 10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <HiHeart className={`w-5 h-5 transition-colors ${clapAnim ? 'text-gold-500' : 'text-ivory-500/20'}`} />
                        </motion.div>
                        <span className="text-ivory-500/30">{post.clap || 0}</span>
                    </motion.button>
                </div>
            </div>
        </motion.article>
    );
};

export default PostCard;
