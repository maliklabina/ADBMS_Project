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
    login: (usernameOrEmail: string, password: string, isAdmin?: boolean) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = 'user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(() => {
        const savedUser = localStorage.getItem(USER_KEY);
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem(USER_KEY);
        const userIsAdmin = localStorage.getItem('isAdmin') === 'true';
        console.log('AuthContext: Checking auth state', { token, savedUser, userIsAdmin });
        if (token && savedUser) {
            setIsAuthenticated(true);
            setUser(JSON.parse(savedUser));
            setIsAdmin(userIsAdmin);
            console.log('AuthContext: User authenticated', { userIsAdmin });
        }
    }, []);

    const login = async (usernameOrEmail: string, password: string, adminLogin: boolean = false) => {
        try {
            const response = adminLogin 
                ? await api.adminLogin({ username: usernameOrEmail, password })
                : await api.userLogin({ email: usernameOrEmail, password });
            setIsAuthenticated(true);
            setUser(response.user);
            setIsAdmin(adminLogin);
            localStorage.setItem(USER_KEY, JSON.stringify(response.user));
            localStorage.setItem('isAdmin', adminLogin.toString());
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await api.userRegister({ username, email, password });
            setIsAuthenticated(true);
            setUser(response.user);
            setIsAdmin(false);
            localStorage.setItem(USER_KEY, JSON.stringify(response.user));
            localStorage.setItem('isAdmin', 'false');
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = () => {
        api.logout();
        setIsAuthenticated(false);
        setUser(null);
        setIsAdmin(false);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem('isAdmin');
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            login, 
            logout,
            register,
            isAdmin
        }}>
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


    // new comment
}
