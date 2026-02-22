import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHeart } from 'react-icons/hi';
import { formatDate } from '../../utils/formatters';

const CommentItem = ({ comment, depth = 0, onReply, onLike, currentUserId }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isLiking, setIsLiking] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Provide default fallback variables
    const hasReplies = comment.reply && comment.reply.length > 0;
    const isClapped = comment.clappedBy?.includes(currentUserId);

    const handleReplySubmit = async () => {
        if (!replyText.trim() || isSubmitting) return;
        setIsSubmitting(true);
        await onReply(comment._id, replyText);
        setReplyText('');
        setShowReplyInput(false);
        setIsSubmitting(false);
    };

    const handleLike = async () => {
        if (isLiking || isClapped) return; // Prevent double-clapping based on schema setup
        setIsLiking(true);
        await onLike(comment._id);
        setIsLiking(false);
    };

    return (
        <div className={`flex gap-3 ${depth > 0 ? 'ml-8 mt-3' : 'mt-4'}`}>
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 p-[1.5px] shrink-0">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">
                    {(comment.createdBy?.username || comment.user?.username || '?')[0]?.toUpperCase()}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                    <span className="font-bold text-[13px] text-white">
                        {comment.createdBy?.username || comment.user?.username || 'Anon'}
                    </span>
                    <span className="text-[11px] text-gray-500">
                        {formatDate(comment.createdAt || new Date())}
                    </span>
                </div>

                <p className="text-[13px] text-gray-300 leading-snug mt-0.5 whitespace-pre-wrap">
                    {comment.content || comment.text}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-4 mt-2 mb-1">
                    <button
                        onClick={handleLike}
                        disabled={isLiking}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-pink-500 transition-colors group"
                    >
                        <HiHeart className={`w-3.5 h-3.5 ${isClapped ? 'text-pink-500' : 'group-hover:text-pink-500 transition-colors'}`} />
                        <span className={`text-[11px] font-medium ${isClapped ? 'text-pink-500' : ''}`}>
                            {comment.clap || comment.likes || 0}
                        </span>
                    </button>

                    <button
                        onClick={() => setShowReplyInput(!showReplyInput)}
                        className="text-[11px] font-medium text-gray-500 hover:text-white transition-colors"
                    >
                        Reply
                    </button>
                </div>

                {/* Inline Reply Input */}
                <AnimatePresence>
                    {showReplyInput && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-2 mb-3 overflow-hidden"
                        >
                            <div className="flex gap-2 items-center">
                                <div className="w-6 h-6 rounded-full bg-gray-800 shrink-0" />
                                <input
                                    type="text"
                                    placeholder={`Reply to ${comment.createdBy?.username || 'Anon'}...`}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleReplySubmit()}
                                    className="flex-1 bg-gray-900 border border-gray-800 rounded-full px-3 py-1.5 text-[12px] text-white focus:outline-none focus:border-pink-500/50"
                                />
                                <button
                                    onClick={handleReplySubmit}
                                    disabled={!replyText.trim() || isSubmitting}
                                    className="text-pink-500 text-[12px] font-bold disabled:opacity-50"
                                >
                                    Post
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Nested Replies */}
                {hasReplies && (
                    <div className="relative before:absolute before:inset-y-0 before:-left-6 before:w-px before:bg-gray-800">
                        {comment.reply.map((replyComment) => (
                            <CommentItem
                                key={replyComment._id}
                                comment={replyComment}
                                depth={depth + 1}
                                onReply={onReply}
                                onLike={onLike}
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
