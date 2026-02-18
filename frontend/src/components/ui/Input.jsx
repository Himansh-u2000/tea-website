import { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    icon: Icon,
    placeholder,
    className = '',
    disabled = false,
    required = false,
    ...props
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`relative ${className}`}>
            {label && (
                <label
                    className={`block mb-2 text-sm font-medium tracking-wide transition-colors duration-200 ${error ? 'text-red-400' : isFocused ? 'text-gold-400' : 'text-ivory-400'
                        }`}
                >
                    {label} {required && <span className="text-gold-500">*</span>}
                </label>
            )}

            <div className="relative">
                {Icon && (
                    <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-gold-500' : 'text-ivory-500/40'}`}>
                        <Icon size={18} />
                    </div>
                )}

                <motion.input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`input-field ${Icon ? 'pl-12' : ''} ${error ? 'border-red-500/50 focus:border-red-500' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    {...props}
                />
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-red-400 flex items-center gap-1.5"
                >
                    <span className="w-1 h-1 bg-red-400 rounded-full" /> {error}
                </motion.p>
            )}
        </div>
    );
};

export default Input;
