import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPhotograph, HiX, HiLocationMarker, HiCheck, HiExclamation } from 'react-icons/hi';
import Button from '../components/ui/Button';
import BottomNav from '../components/ui/BottomNav';
import { uploadImage } from '../services/cloudinaryService';
import { createPost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { getCurrentPosition } from '../utils/geolocation';

const CreatePost = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        locationEnabled: true,
    });
    const [publishing, setPublishing] = useState(false);
    const [error, setError] = useState('');

    // ─── Background Upload Logic ───
    const startBackgroundUpload = useCallback((imageEntry) => {
        uploadImage(imageEntry.file, (progress) => {
            setImages(prev => prev.map(img =>
                img.id === imageEntry.id ? { ...img, progress } : img
            ));
        })
            .then(url => {
                setImages(prev => prev.map(img =>
                    img.id === imageEntry.id ? { ...img, cloudinaryUrl: url, status: 'done', progress: 100 } : img
                ));
            })
            .catch(() => {
                setImages(prev => prev.map(img =>
                    img.id === imageEntry.id ? { ...img, status: 'error' } : img
                ));
            });
    }, []);

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const newImages = files.map(file => {
            const entry = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                file,
                localUrl: URL.createObjectURL(file),
                cloudinaryUrl: null,
                status: 'uploading',
                progress: 0,
            };
            startBackgroundUpload(entry);
            return entry;
        });

        setImages(prev => [...prev, ...newImages]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeImage = (id) => {
        setImages(prev => {
            const img = prev.find(i => i.id === id);
            if (img) URL.revokeObjectURL(img.localUrl);
            return prev.filter(i => i.id !== id);
        });
    };

    const retryUpload = (id) => {
        setImages(prev => prev.map(img =>
            img.id === id ? { ...img, status: 'uploading', progress: 0 } : img
        ));
        const entry = images.find(i => i.id === id);
        if (entry) startBackgroundUpload(entry);
    };

    const allUploaded = images.length > 0 && images.every(img => img.status === 'done');
    const hasErrors = images.some(img => img.status === 'error');
    const isUploading = images.some(img => img.status === 'uploading');

    const handlePublish = async () => {
        if (!formData.title.trim()) { setError('Give your gossip a title'); return; }
        if (!formData.content.trim()) { setError('Spill the tea!'); return; }
        if (images.length === 0) { setError('Add at least one image'); return; }
        if (!allUploaded) { setError('Wait for images to finish uploading'); return; }

        setPublishing(true);
        setError('');

        try {
            let lat = null, lng = null;
            if (formData.locationEnabled) {
                try {
                    const pos = await getCurrentPosition();
                    lat = pos.lat;
                    lng = pos.lng;
                } catch (_) { }
            }

            const cloudinaryUrls = images.map(img => img.cloudinaryUrl);

            await createPost({
                title: formData.title,
                content: formData.content,
                thumbnail: cloudinaryUrls[0],
                images: cloudinaryUrls,
                createdBy: user?._id || user?.id,
                lat,
                lng,
            });

            navigate('/');
        } catch (_) {
            setError('Failed to publish. Please try again.');
        } finally {
            setPublishing(false);
        }
    };

    return (
        <div className="min-h-screen pb-28">
            {/* Header */}
            <header className="sticky top-0 z-40 px-4 py-3"
                style={{
                    background: 'rgba(10, 10, 11, 0.85)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid #2a2a2e',
                }}
            >
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/')} className="text-muted hover:text-white transition-colors text-sm">
                            ← Back
                        </button>
                        <h1 className="text-lg font-display font-bold text-white">New Post</h1>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        {isUploading && (
                            <span className="px-2 py-1 rounded-full bg-accent/10 text-accent">Uploading...</span>
                        )}
                        {hasErrors && (
                            <span className="px-2 py-1 rounded-full bg-red-500/10 text-red-400">Error</span>
                        )}
                        {allUploaded && (
                            <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-400">Ready ✓</span>
                        )}
                    </div>
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
                {error && (
                    <motion.div
                        className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {error}
                    </motion.div>
                )}

                {/* Title */}
                <div>
                    <input
                        type="text"
                        placeholder="What's the gossip? ☕"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-transparent text-xl font-display font-bold text-white placeholder-dark-50 outline-none py-2"
                    />
                </div>

                {/* Content */}
                <div>
                    <textarea
                        placeholder="Spill the tea, bestie... 💅"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={5}
                        className="w-full bg-transparent text-[15px] text-gray-300 placeholder-dark-50 outline-none resize-none leading-relaxed"
                    />
                </div>

                <div className="divider" />

                {/* Images Grid */}
                <div>
                    <div className="grid grid-cols-3 gap-2">
                        <AnimatePresence>
                            {images.map(img => (
                                <motion.div
                                    key={img.id}
                                    className="relative aspect-square rounded-xl overflow-hidden bg-dark-200"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    layout
                                >
                                    <img src={img.localUrl} alt="" className="w-full h-full object-cover" />

                                    {/* Upload overlay */}
                                    {img.status === 'uploading' && (
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                                            <div className="w-8 h-8 rounded-full border-2 border-dark-50 border-t-accent animate-spin" />
                                            <span className="text-[10px] text-white/70">{img.progress}%</span>
                                        </div>
                                    )}

                                    {/* Done badge */}
                                    {img.status === 'done' && (
                                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                            <HiCheck className="w-3 h-3 text-white" />
                                        </div>
                                    )}

                                    {/* Error overlay */}
                                    {img.status === 'error' && (
                                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-1">
                                            <HiExclamation className="w-5 h-5 text-red-400" />
                                            <button
                                                onClick={() => retryUpload(img.id)}
                                                className="text-[10px] text-accent underline"
                                            >
                                                Retry
                                            </button>
                                        </div>
                                    )}

                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeImage(img.id)}
                                        className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80 transition-colors"
                                    >
                                        <HiX className="w-3 h-3 text-white" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Add image button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-dark-50 hover:border-accent/30 flex flex-col items-center justify-center gap-1 transition-colors"
                        >
                            <HiPhotograph className="w-6 h-6 text-muted" />
                            <span className="text-[10px] text-muted">Add</span>
                        </motion.button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                </div>

                {/* Location toggle */}
                <div className="flex items-center justify-between glass-card p-3">
                    <div className="flex items-center gap-2">
                        <HiLocationMarker className={`w-4 h-4 ${formData.locationEnabled ? 'text-accent' : 'text-muted'}`} />
                        <span className="text-sm text-gray-300">Add location</span>
                    </div>
                    <button
                        onClick={() => setFormData({ ...formData, locationEnabled: !formData.locationEnabled })}
                        className={`w-10 h-6 rounded-full transition-all duration-300 relative ${formData.locationEnabled ? 'bg-accent' : 'bg-dark-50'
                            }`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all duration-300 ${formData.locationEnabled ? 'left-5' : 'left-1'
                            }`} />
                    </button>
                </div>

                {/* Publish */}
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handlePublish}
                    loading={publishing}
                    disabled={publishing || isUploading}
                >
                    {isUploading ? 'Uploading images...' : 'Post the Tea ☕'}
                </Button>
            </div>

            <BottomNav />
        </div>
    );
};

export default CreatePost;
