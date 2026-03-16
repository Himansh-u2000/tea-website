import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiHeart, HiPaperAirplane } from 'react-icons/hi';
import { formatDate } from '../../utils/formatters';

const CommentItem = ({ comment, depth = 0, onReply, onLike, currentUserId }) => {
    const [isLiking, setIsLiking] = useState(false);

    // Provide default fallback variables
    const hasReplies = comment.reply && comment.reply.length > 0;
    const isClapped = comment.clappedBy?.includes(currentUserId);

    const handleReplyClick = () => {
        onReply(comment);
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
                            {comment.clappedBy?.length || 0}
                        </span>
                    </button>

                    <button
                        onClick={handleReplyClick}
                        className="text-[11px] font-medium text-gray-500 hover:text-white transition-colors"
                    >
                        Reply
                    </button>
                </div>

                {/* Inline Reply Input Removed - Delegated to parent Modal */}

                {/* Nested Replies */}
                {hasReplies && (
                    <div className="relative border-l-2 border-gray-800/80 pl-4 mt-2 ml-1">
                        {comment.reply.map((replyComment) => (
                            <div key={replyComment._id} className="relative">
                                {/* Horizontal connector branch */}
                                <div className="absolute -left-4 top-5 w-3 h-[2px] bg-gray-800/80 rounded-r-full" />
                                <CommentItem
                                    comment={replyComment}
                                    depth={depth + 1}
                                    onReply={onReply}
                                    onLike={onLike}
                                    currentUserId={currentUserId}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
