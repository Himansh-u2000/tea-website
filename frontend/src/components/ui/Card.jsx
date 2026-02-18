import { motion } from 'framer-motion';

const Card = ({
    children,
    className = '',
    hover = true,
    onClick,
    ...props
}) => {
    const baseClasses = 'glass-card p-6';
    const hoverClasses = hover ? 'cursor-pointer hover:bg-white/15 hover:scale-[1.02]' : '';

    return (
        <motion.div
            className={`${baseClasses} ${hoverClasses} ${className}`}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
