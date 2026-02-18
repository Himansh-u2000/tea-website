import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gold-700/20 border-t-gold-500"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
                <p className="text-ivory-500/25 text-xs tracking-widest uppercase">Loading</p>
            </div>
        </div>
    );
};

export const SimpleLoader = () => {
    return (
        <div className="flex items-center justify-center p-8">
            <motion.div
                className="w-8 h-8 rounded-full border-2 border-gold-700/20 border-t-gold-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
        </div>
    );
};

export default Loader;
