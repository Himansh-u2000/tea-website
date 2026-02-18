import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPhotograph, HiX, HiLocationMarker, HiCheck, HiExclamation } from 'react-icons/hi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import BottomNav from '../components/ui/BottomNav';
import { uploadImage } from '../services/cloudinaryService';
import { createPost } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { getCurrentPosition } from '../utils/geolocation';

const CreatePost = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    // Each image: { id, file, localUrl, cloudinaryUrl, status: 'uploading' | 'done' | 'error', progress }
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
            // Start uploading immediately in background
            startBackgroundUpload(entry);
            return entry;
        });

        setImages(prev => [...prev, ...newImages]);
        // Reset input so same file can be re-selected
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
        if (!formData.title.trim()) {
            setError('Give your post a title');
            return;
        }
        if (!formData.content.trim()) {
            setError('Write something beautiful');
            return;
        }
        if (images.length === 0) {
            setError('Add at least one image');
            return;
        }
        if (!allUploaded) {
            setError('Please wait for all images to finish uploading');
            return;
        }

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
                createdBy: user.id,
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
            <header className="sticky top-0 z-40 glass-card border-b border-gold-700/10 px-4 py-4">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="text-ivory-500/40 hover:text-ivory-200 transition-colors text-sm">
                            ← Back
                        </button>
                        <h1 className="text-xl font-display font-bold text-gold">Create Post</h1>
                    </div>
                    {images.length > 0 && (
                        <div className="flex items-center gap-2 text-xs">
                            {isUploading && <span className="upload-badge-pending">Uploading...</span>}
                            {hasErrors && <span className="upload-badge-error">Error</span>}
                            {allUploaded && <span className="upload-badge-done">Ready ✓</span>}
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-2xl mx-auto px-4 mt-6 space-y-6">

                {/* ─── Image Upload Area ─── */}
                <div className="glass-card overflow-hidden">
                    {/* Upload Dropzone */}
                    <div
                        className="p-6 border-b border-gold-700/10 cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageSelect}
                            className="hidden"
                        />
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-glass border border-gold-700/15 flex items-center justify-center group-hover:border-gold-600/30 transition-colors">
                                <HiPhotograph className="w-6 h-6 text-gold-500" />
                            </div>
                            <div>
                                <p className="text-ivory-200 font-medium">Add Photos</p>
                                <p className="text-ivory-500/30 text-sm">Tap to select • Uploads start instantly</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Previews Grid */}
                    <AnimatePresence>
                        {images.length > 0 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="p-4"
                            >
                                <div className="grid grid-cols-3 gap-3">
                                    {images.map((img) => (
                                        <motion.div
                                            key={img.id}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="relative aspect-square rounded-xl overflow-hidden group"
                                        >
                                            <img
                                                src={img.localUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Upload overlay */}
                                            {img.status === 'uploading' && (
                                                <div className="absolute inset-0 bg-obsidian-400/70 flex flex-col items-center justify-center">
                                                    <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mb-2" />
                                                    <span className="text-gold-400 text-xs font-medium">{img.progress}%</span>
                                                </div>
                                            )}

                                            {/* Done checkmark */}
                                            {img.status === 'done' && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                                                >
                                                    <HiCheck className="w-4 h-4 text-white" />
                                                </motion.div>
                                            )}

                                            {/* Error indicator */}
                                            {img.status === 'error' && (
                                                <div className="absolute inset-0 bg-obsidian-400/70 flex flex-col items-center justify-center">
                                                    <HiExclamation className="w-6 h-6 text-red-400 mb-1" />
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); retryUpload(img.id); }}
                                                        className="text-xs text-gold-400 underline"
                                                    >
                                                        Retry
                                                    </button>
                                                </div>
                                            )}

                                            {/* Remove button */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                                                className="absolute top-2 right-2 w-7 h-7 bg-obsidian-400/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-gold-700/20"
                                            >
                                                <HiX className="w-3.5 h-3.5 text-ivory-300" />
                                            </button>
                                        </motion.div>
                                    ))}

                                    {/* Add more button */}
                                    <motion.div
                                        className="aspect-square rounded-xl border-2 border-dashed border-gold-700/15 flex items-center justify-center cursor-pointer hover:border-gold-600/30 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className="text-2xl text-gold-700/40">+</span>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ─── Text Content ─── */}
                <div className="glass-card p-6 space-y-5">
                    <Input
                        label="Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Give it a captivating title..."
                        required
                    />

                    <div>
                        <label className="block mb-2 text-sm font-medium tracking-wide text-ivory-400">
                            Content <span className="text-gold-500">*</span>
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Tell your story..."
                            rows={6}
                            className="input-field resize-none"
                        />
                        <div className="flex justify-between mt-2">
                            <p className="text-xs text-ivory-500/25">{formData.content.length} characters</p>
                        </div>
                    </div>

                    {/* Location Toggle */}
                    <div
                        className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors"
                        style={{ background: formData.locationEnabled ? 'rgba(212, 168, 71, 0.06)' : 'rgba(255,255,255,0.02)' }}
                        onClick={() => setFormData({ ...formData, locationEnabled: !formData.locationEnabled })}
                    >
                        <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${formData.locationEnabled ? 'bg-gold-600' : 'bg-obsidian-50'}`}>
                            <motion.div
                                className="absolute top-0.5 w-5 h-5 bg-ivory-50 rounded-full shadow-md"
                                animate={{ left: formData.locationEnabled ? '18px' : '2px' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        </div>
                        <HiLocationMarker className={`w-4 h-4 transition-colors ${formData.locationEnabled ? 'text-gold-500' : 'text-ivory-500/25'}`} />
                        <span className={`text-sm transition-colors ${formData.locationEnabled ? 'text-ivory-200' : 'text-ivory-500/30'}`}>
                            Share location
                        </span>
                    </div>
                </div>

                {/* ─── Error ─── */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass-card p-4 border-red-500/20 text-red-400 text-sm text-center"
                            style={{ borderColor: 'rgba(239, 83, 80, 0.2)' }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ─── Publish Button ─── */}
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePublish}
                    loading={publishing}
                    disabled={images.length === 0 || !allUploaded || publishing}
                    className="w-full"
                >
                    {isUploading ? 'Images still uploading...' : 'Publish Post'}
                </Button>
            </div>

            <BottomNav />
        </div>
    );
};

export default CreatePost;
