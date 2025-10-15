import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface AuthUser {
    id: string;
    username: string;
    email: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: AuthUser | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = 'user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(() => {
        const savedUser = localStorage.getItem(USER_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem(USER_KEY);
        if (token && savedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.adminLogin({ email, password });
            setIsAuthenticated(true);
            setUser(response.user);
            localStorage.setItem(USER_KEY, JSON.stringify(response.user));
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        api.logout();
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem(USER_KEY);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
