import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
        setLoading(false);
        setLoading(false);
    };

    const handleGoogleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {
            try {
                setLoading(true);
                // Hardcoding lat/lng here just for compatibility; typically we'd use navigator.geolocation
                const result = await googleLogin(codeResponse.code, '', '');
                if (result.success) {
                    navigate('/');
                } else {
                    setError('Google Login failed via server');
                }
            } catch (err) {
                setError('Google Login failed');
            } finally {
                setLoading(false);
            }
        },
        onError: () => setError('Google Login Failed')
    });

    return (
        <div className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden">
            {/* Parallax orbs */}
            <div className="orb orb-accent w-72 h-72 -top-20 -right-20 animate-float" />
            <div className="orb orb-warm w-96 h-96 -bottom-32 -left-32 animate-float-slow" />
            <div className="orb orb-accent w-48 h-48 top-1/3 left-1/4 animate-float-delay" />

            <motion.div
                className="w-full max-w-sm relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <motion.h1
                        className="text-4xl font-display font-bold text-gradient mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        Tea ☕
                    </motion.h1>
                    <motion.p
                        className="text-muted text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Spill the tea, sis 💅
                    </motion.p>
                </div>

                <motion.div
                    className="glass-card-elevated p-6"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <motion.div
                                className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <Input
                            label="Email"
                            icon={HiMail}
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            label="Password"
                            icon={HiLockClosed}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            loading={loading}
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 flex flex-col gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-700"></span>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-black px-2 text-gray-400">Or continue with</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleGoogleLogin()}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-700 rounded-xl bg-gray-900/50 hover:bg-gray-800 transition-colors"
                        >
                            <FcGoogle className="w-5 h-5" />
                            <span className="text-white font-medium">Google</span>
                        </button>

                        <p className="text-center text-muted text-sm mt-2">
                            New here?{' '}
                            <Link to="/signup" className="text-accent font-semibold hover:underline">
                                Create account
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
