import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiPaperAirplane } from 'react-icons/hi';
import CommentItem from './CommentItem';
import { getComments, addComment, addReply, likeComment } from '../../services/commentService';
import { useAuth } from '../../context/AuthContext';
import Loader from '../ui/Loader';

const PostDetailModal = ({ post, isOpen, onClose }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCommentText, setNewCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && post?._id) {
            fetchComments();
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, post?._id]);

    const fetchComments = async () => {
        try {
            setLoading(true);
            const res = await getComments(post._id);
            if (res.success) {
                // Determine top-level comments: 
                // Any comment that is NOT present inside another comment's `reply` array.
                // Since Mongoose returns a flat array populated with refs, we need to structure it.
                const allComments = res.data;
                const replyIds = new Set();

                // Find all IDs that are inner replies
                allComments.forEach(c => {
                    if (c.reply && c.reply.length > 0) {
                        c.reply.forEach(r => {
                            replyIds.add(r._id ? r._id.toString() : r.toString());
                        });
                    }
                });

                // Top-Level comments
                const topLevel = allComments.filter(c => !replyIds.has(c._id.toString()));

                // For each top-level, their populated `reply` array is structured correctly by Mongoose
                setComments(topLevel);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async () => {
        if (!newCommentText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await addComment(post._id, newCommentText.trim(), user?._id || user?.id);
            setNewCommentText('');
            fetchComments(); // Reload to get fresh tree
        } catch (error) {
            console.error('Failed to post comment', error);
        }
        setIsSubmitting(false);
    };

    const handleReply = async (commentId, content) => {
        try {
            await addReply(commentId, content, user?._id || user?.id);
            fetchComments(); // Reload to get fresh tree
        } catch (error) {
            console.error('Failed to reply', error);
        }
    };

    const handleLike = async (commentId) => {
        try {
            await likeComment(commentId, user?._id);
            fetchComments(); // Reload to get fresh tree
        } catch (error) {
            console.error('Failed to like', error);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
                {/* Backdrop Layer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="relative w-full max-w-lg bg-black border border-gray-800 sm:rounded-2xl rounded-t-3xl h-[85vh] sm:h-[80vh] flex flex-col overflow-hidden shadow-2xl z-10"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-900 bg-black/95 sticky top-0 z-20">
                        <h2 className="text-lg font-bold text-white">Discussion</h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-900 text-gray-400 hover:text-white transition-colors"
                        >
                            <HiX className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Scrollable Thread Region */}
                    <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                        {/* Original Post Context (Slim) */}
                        <div className="p-5 border-b border-gray-900 bg-dark-50/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 p-[1.5px] shrink-0">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                        {(post?.owner?.username || post?.author || '?')[0]?.toUpperCase()}
                                    </div>
                                </div>
                                <span className="font-bold text-[14px] text-white">
                                    {post?.owner?.username || post?.author || 'Anonymous'}
                                </span>
                            </div>
                            <p className="text-[14px] text-gray-200 leading-relaxed font-normal whitespace-pre-wrap ml-11">
                                {post?.title} {post?.content || post?.gossip}
                            </p>
                        </div>

                        {/* Comments Thread */}
                        <div className="px-5 py-2">
                            {loading ? (
                                <div className="py-10 flex justify-center">
                                    <Loader text="Loading threads..." />
                                </div>
                            ) : comments.length > 0 ? (
                                comments.map(c => (
                                    <CommentItem
                                        key={c._id}
                                        comment={c}
                                        onReply={handleReply}
                                        onLike={handleLike}
                                        currentUserId={user?._id || user?.id}
                                    />
                                ))
                            ) : (
                                <div className="py-16 text-center text-gray-500">
                                    <p className="text-sm">Be the first to start the discussion.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Root Comment Input */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-900 z-20">
                        <div className="flex items-center gap-3 max-w-lg mx-auto bg-gray-900 p-1.5 rounded-full border border-gray-800 shadow-xl focus-within:border-pink-500/50 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-pink-500/20 flex-shrink-0 ml-1" />
                            <input
                                autoFocus
                                type="text"
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                                placeholder="Add a comment..."
                                className="flex-1 bg-transparent border-none outline-none text-[13px] text-white placeholder-gray-500 min-w-0"
                            />
                            <button
                                onClick={handlePostComment}
                                disabled={!newCommentText.trim() || isSubmitting}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-pink-500/20 text-pink-500 mr-0.5 disabled:opacity-50 hover:bg-pink-500 hover:text-white transition-all transform active:scale-95"
                            >
                                <HiPaperAirplane className="w-4 h-4 translate-x-px translate-y-px" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default PostDetailModal;
