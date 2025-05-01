"use client";
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    const login = async (email, password) => {
        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                setUser(data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('user_id', data.user._id);
                
                const expiryTime = Date.now() + SESSION_TIMEOUT;
                localStorage.setItem('sessionExpiry', expiryTime.toString());

                return data;
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setUser(null);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('user_id');
                localStorage.removeItem('sessionExpiry');
                return true;
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    };

    useEffect(() => {
        const checkAuth = () => {
            const savedUser = localStorage.getItem('user');
            const sessionExpiry = localStorage.getItem('sessionExpiry');
            const token = localStorage.getItem('token');

            if (savedUser && sessionExpiry && token) {
                const currentTime = Date.now();
                if (currentTime < parseInt(sessionExpiry, 10)) {
                    setUser(JSON.parse(savedUser));
                } else {
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const authInfo = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;