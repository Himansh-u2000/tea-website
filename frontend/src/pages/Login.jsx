import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/');
        } else {
            setErrors({ general: result.error });
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle gold ambient glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />

            <motion.div
                className="w-full max-w-md relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            >
                <div className="glass-card p-8">
                    <div className="text-center mb-10">
                        <motion.h1
                            className="text-4xl font-display font-bold text-gold mb-3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            Welcome Back
                        </motion.h1>
                        <p className="text-ivory-500/40 text-sm tracking-wide">Sign in to your exclusive space</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {errors.general && (
                            <motion.div
                                className="glass-card p-4 text-red-400 text-sm text-center"
                                style={{ borderColor: 'rgba(239, 83, 80, 0.2)' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {errors.general}
                            </motion.div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            icon={HiMail}
                            placeholder="you@example.com"
                            required
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            icon={HiLockClosed}
                            placeholder="••••••••"
                            required
                            error={errors.password}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            loading={loading}
                            className="w-full"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <div className="divider-gold mb-6" />
                        <p className="text-ivory-500/30 text-sm">
                            New here?{' '}
                            <Link to="/signup" className="text-gold-500 hover:text-gold-400 font-semibold transition-colors">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
