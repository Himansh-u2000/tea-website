import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    onClick,
    className = '',
    type = 'button',
    ...props
}) => {
    const baseClasses = 'font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed tracking-wide';

    const variants = {
        primary: 'btn-luxury',
        secondary: 'btn-outline-gold',
        outline: 'btn-outline-gold',
        ghost: 'btn-ghost',
        accent: 'btn-luxury',
    };

    const sizes = {
        sm: 'py-2.5 px-5 text-sm',
        md: 'py-3 px-6 text-base',
        lg: 'py-4 px-8 text-lg',
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
            whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
            {...props}
        >
            {loading ? (
                <>
                    <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                    <span className="opacity-80">Loading...</span>
                </>
            ) : (
                children
            )}
        </motion.button>
    );
};

export default Button;
