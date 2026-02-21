import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import FindPosts from './pages/FindPosts';
import Recommended from './pages/Recommended';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        {/* Protected Routes */}
                        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                        <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
                        <Route path="/find" element={<ProtectedRoute><FindPosts /></ProtectedRoute>} />
                        <Route path="/recommended" element={<ProtectedRoute><Recommended /></ProtectedRoute>} />
                        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        <Route path="/subscribe" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </AuthProvider >
    );
}

export default App;
