import { motion } from 'framer-motion';

const variants = {
    primary: 'btn-accent',
    ghost: 'bg-transparent text-muted hover:text-white hover:bg-dark-100 border border-transparent hover:border-dark-50 rounded-xl transition-all duration-300',
    outline: 'bg-transparent border border-dark-50 text-white hover:border-accent hover:text-accent rounded-xl transition-all duration-300',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-all duration-300',
};

const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
};

const Button = ({ children, variant = 'primary', size = 'md', loading, disabled, className = '', ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.97 }}
            className={`${variants[variant]} ${sizes[size]} font-medium inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </motion.button>
    );
};

export default Button;
