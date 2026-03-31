import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BlogProvider } from './context/BlogContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import BlogEditor from './pages/admin/BlogEditor';
import './index.css';

/**
 * ProtectedRoute — redirects to /admin/login if user is not authenticated.
 * Wraps any admin-only pages.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

/**
 * AppInner — defined inside providers so useAuth() works in ProtectedRoute.
 */
function AppInner() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* ── Public routes ──────────────────────────────── */}
        <Route path="/"            element={<Home />}     />
        <Route path="/projects"    element={<Projects />} />
        <Route path="/blog"        element={<Blog />}     />
        <Route path="/blog/:slug"  element={<BlogPost />} />

        {/* ── Admin routes ───────────────────────────────── */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/admin/new"
          element={<ProtectedRoute><BlogEditor /></ProtectedRoute>}
        />
        <Route
          path="/admin/edit/:id"
          element={<ProtectedRoute><BlogEditor /></ProtectedRoute>}
        />

        {/* ── Fallback ────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

/**
 * App — top-level with context providers.
 * Order matters: AuthProvider wraps BlogProvider wraps AppInner.
 */
export default function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <AppInner />
      </BlogProvider>
    </AuthProvider>
  );
}
