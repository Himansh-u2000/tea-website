import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiSearch, HiPlusCircle, HiLocationMarker, HiUser, HiStar } from 'react-icons/hi';

const navItems = [
    { path: '/', icon: HiHome, label: 'Home' },
    { path: '/find', icon: HiSearch, label: 'Explore' },
    { path: '/recommended', icon: HiLocationMarker, label: 'Nearby' },
    { path: '/subscribe', icon: HiStar, label: 'Premium' },
    { path: '/profile', icon: HiUser, label: 'Profile' },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-gray-800 bg-black text-white p-4">
            <div className="flex items-center gap-3 mb-10 px-4 mt-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center">
                    <span className="font-bold text-white text-lg">T</span>
                </div>
                <h1 className="text-xl font-bold tracking-wider">TEA<span className="text-pink-500">.</span></h1>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
                {navItems.map(({ path, icon: Icon, label }) => {
                    const isActive = location.pathname === path;

                    return (
                        <NavLink key={path} to={path} className="relative group">
                            <motion.div
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-gray-900 text-white font-semibold' : 'text-gray-400 hover:bg-gray-900/50 hover:text-white'}`}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Icon className={`w-6 h-6 ${isActive ? 'text-pink-500' : ''}`} />
                                <span className="text-lg">{label}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebarIndicator"
                                        className="absolute left-0 w-1 h-8 bg-pink-500 rounded-r-full"
                                    />
                                )}
                            </motion.div>
                        </NavLink>
                    );
                })}

                <NavLink to="/create" className="mt-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
                    >
                        <HiPlusCircle className="w-6 h-6" />
                        <span>Create Post</span>
                    </motion.button>
                </NavLink>
            </nav>

            <div className="mt-auto px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold">User</p>
                        <p className="text-xs text-gray-500">@username</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
