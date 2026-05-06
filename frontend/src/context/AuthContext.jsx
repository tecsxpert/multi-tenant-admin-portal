import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginRequest } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Session recovery failed", e);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await loginRequest(username, password);
            const { token, ...userData } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return true;
        } catch (error) {
            // DUMMY LOGIN FALLBACK FOR TESTING
            if (username === 'admin' && password === 'admin123') {
                const dummyUser = { username: 'admin', role: 'ADMIN' };
                const dummyToken = 'dummy-jwt-token';
                
                localStorage.setItem('token', dummyToken);
                localStorage.setItem('user', JSON.stringify(dummyUser));
                setUser(dummyUser);
                return true;
            }
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
