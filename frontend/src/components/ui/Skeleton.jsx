const Skeleton = ({ className = '' }) => (
    <div className={`skeleton ${className}`} />
);

const PostCardSkeleton = () => (
    <div className="glass-card p-4 space-y-3 animate-fade-up">
        <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-2.5 w-16 rounded" />
            </div>
        </div>
        <Skeleton className="h-3.5 w-3/4 rounded" />
        <Skeleton className="h-52 w-full rounded-xl" />
        <div className="flex items-center gap-4 pt-1">
            <Skeleton className="h-3 w-14 rounded" />
            <Skeleton className="h-3 w-14 rounded" />
        </div>
    </div>
);

const ProfileSkeleton = () => (
    <div className="space-y-6 animate-fade-up">
        <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
            </div>
        </div>
        <div className="flex gap-6">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 flex-1 rounded-xl" />
        </div>
    </div>
);

export default Skeleton;
export { PostCardSkeleton, ProfileSkeleton };
