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

    // Function to get real user data from server using user_id
    const getCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');
            
            if (!token || !userId) {
                throw new Error('No token or user ID found');
            }

            const response = await fetch(`${baseUrl}/users/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
                return userData;
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
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
                    // Set initial user data from localStorage for immediate display
                    setUser(JSON.parse(savedUser));
                    
                    // Always fetch fresh user data from server to get current role
                    getCurrentUser().catch((error) => {
                        console.error('Failed to fetch fresh user data:', error);
                        // If fetching fails, keep the cached data
                    });
                } else {
                    logout();
                }
            }
            setLoading(false);
        };

        checkAuth();

        // Set up periodic refresh every 5 minutes to keep user data current
        const refreshInterval = setInterval(() => {
            const token = localStorage.getItem('token');
            if (token) {
                getCurrentUser().catch(console.error);
            }
        }, 5 * 60 * 1000); // 5 minutes

        // Refresh user data when app becomes visible (user switches back to tab)
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                const token = localStorage.getItem('token');
                if (token) {
                    getCurrentUser().catch(console.error);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup intervals and event listeners
        return () => {
            clearInterval(refreshInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const authInfo = {
        user,
        loading,
        login,
        logout,
        getCurrentUser, // Export the function so it can be used in components
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;