const Skeleton = ({ type = 'text', className = '', width, height }) => {
    const types = {
        text: 'h-4 w-full rounded',
        title: 'h-6 w-3/4 rounded',
        avatar: 'h-10 w-10 rounded-full',
        image: 'h-48 w-full rounded-xl',
        card: 'h-64 w-full rounded-2xl',
        button: 'h-11 w-28 rounded-xl',
    };

    const style = {
        width: width || undefined,
        height: height || undefined,
    };

    return (
        <div
            className={`skeleton ${types[type]} ${className}`}
            style={style}
        />
    );
};

export const PostCardSkeleton = () => {
    return (
        <div className="glass-card overflow-hidden">
            <Skeleton type="image" className="rounded-none" />
            <div className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                    <Skeleton type="avatar" />
                    <div className="flex-1 space-y-2">
                        <Skeleton type="text" width="40%" />
                        <Skeleton type="text" width="20%" />
                    </div>
                </div>
                <Skeleton type="title" />
                <Skeleton type="text" />
                <Skeleton type="text" width="60%" />
            </div>
        </div>
    );
};

export const ProfileSkeleton = () => {
    return (
        <div className="space-y-6">
            <div className="glass-card p-8 text-center space-y-4">
                <Skeleton type="avatar" className="w-20 h-20 mx-auto" />
                <Skeleton type="title" className="mx-auto" width="40%" />
                <Skeleton type="text" className="mx-auto" width="30%" />
            </div>
        </div>
    );
};

export default Skeleton;
