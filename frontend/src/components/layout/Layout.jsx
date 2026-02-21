import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from '../ui/BottomNav';

const Layout = ({ children }) => {
    const location = useLocation();

    // Hide navigation on auth pages
    const isAuthPage = ['/login', '/signup'].includes(location.pathname);

    if (isAuthPage) {
        return <div className="min-h-screen bg-black text-white">{children}</div>;
    }

    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 w-full md:ml-64 pb-20 md:pb-0 min-h-screen relative overflow-x-hidden">
                <div className="max-w-2xl mx-auto w-full h-full">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
};

export default Layout;
