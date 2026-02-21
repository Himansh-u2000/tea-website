import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiSearch, HiPlusCircle, HiLocationMarker, HiUser } from 'react-icons/hi';

const navItems = [
    { path: '/', icon: HiHome, label: 'Home' },
    { path: '/find', icon: HiSearch, label: 'Find' },
    { path: '/create', icon: HiPlusCircle, label: '', special: true },
    { path: '/recommended', icon: HiLocationMarker, label: 'Nearby' },
    { path: '/profile', icon: HiUser, label: 'Profile' },
];

const BottomNav = () => {
    const location = useLocation();

    return (
        <nav className="fixed bottom-5 left-4 right-4 z-50">
            <div className="max-w-md mx-auto">
                <div className="flex items-center justify-around py-2 px-2 rounded-2xl"
                    style={{
                        background: 'rgba(20, 20, 22, 0.85)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        border: '1px solid rgba(42, 42, 46, 0.6)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                >
                    {navItems.map(({ path, icon: Icon, label, special }) => {
                        const isActive = location.pathname === path;

                        if (special) {
                            return (
                                <NavLink key={path} to={path} className="relative -mt-5">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-12 h-12 rounded-full flex items-center justify-center shadow-glow"
                                        style={{
                                            background: 'linear-gradient(135deg, #ff6b35, #ff3d7f)',
                                        }}
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </motion.div>
                                </NavLink>
                            );
                        }

                        return (
                            <NavLink key={path} to={path} className="relative flex flex-col items-center gap-0.5 px-3 py-1.5">
                                <motion.div whileTap={{ scale: 0.85 }}>
                                    <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-accent' : 'text-muted'}`} />
                                </motion.div>
                                <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-accent' : 'text-muted'}`}>
                                    {label}
                                </span>
                                {isActive && (
                                    <motion.div
                                        layoutId="navIndicator"
                                        className="absolute -bottom-1 w-1 h-1 rounded-full bg-accent"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;
