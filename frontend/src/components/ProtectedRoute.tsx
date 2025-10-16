import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Short timeout to allow the auth state to be loaded
        const timer = setTimeout(() => setIsLoading(false), 100);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
