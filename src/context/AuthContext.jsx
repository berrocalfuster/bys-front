import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('app_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Error parsing stored user', e);
                localStorage.removeItem('app_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('app_user', JSON.stringify(userData));
    };

    const updateUser = (partialData) => {
        setUser(prev => {
            const updated = { ...prev, ...partialData };
            localStorage.setItem('app_user', JSON.stringify(updated));
            return updated;
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('app_user');
    };

    // A 401 from the API means the stored session token is missing/expired/invalid
    // (e.g. a session started before this device had a real token) — log out cleanly
    // instead of leaving stale state that keeps failing every request.
    useEffect(() => {
        const handleUnauthorized = () => logout();
        window.addEventListener('bys:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('bys:unauthorized', handleUnauthorized);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, updateUser, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
