import { NavLink, useLocation } from 'react-router-dom';
import { HiHome, HiSearch, HiPlusCircle, HiLocationMarker, HiUser } from 'react-icons/hi';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: HiHome, label: 'Home' },
        { path: '/find', icon: HiSearch, label: 'Find' },
        { path: '/create', icon: HiPlusCircle, label: 'Create', special: true },
        { path: '/recommended', icon: HiLocationMarker, label: 'Nearby' },
        { path: '/profile', icon: HiUser, label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
            <div className="glass-card rounded-t-3xl border-t border-gold-700/20 px-4 py-3">
                <div className="flex items-center justify-around max-w-lg mx-auto">
                    {navItems.map(({ path, icon: Icon, label, special }) => {
                        const isActive = location.pathname === path;

                        if (special) {
                            return (
                                <NavLink key={path} to={path} className="relative -mt-8">
                                    <motion.div
                                        className="w-16 h-16 bg-gradient-luxury rounded-full flex items-center justify-center shadow-gold-lg glow-gold"
                                        whileTap={{ scale: 0.9 }}
                                        whileHover={{ scale: 1.08 }}
                                    >
                                        <Icon className="w-7 h-7 text-obsidian-400" />
                                    </motion.div>
                                </NavLink>
                            );
                        }

                        return (
                            <NavLink key={path} to={path} className="relative flex-1 flex flex-col items-center gap-1 py-2">
                                <motion.div className="relative" whileTap={{ scale: 0.9 }}>
                                    <Icon
                                        className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-gold-500' : 'text-ivory-500/30'}`}
                                    />
                                    {isActive && (
                                        <motion.div
                                            layoutId="bottomNav"
                                            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gold-500 rounded-full"
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                                <span className={`text-[10px] tracking-wider uppercase transition-colors duration-300 ${isActive ? 'text-gold-500 font-semibold' : 'text-ivory-500/25'}`}>
                                    {label}
                                </span>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;
