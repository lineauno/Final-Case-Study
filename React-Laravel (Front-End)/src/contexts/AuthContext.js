import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

/**
 * Custom hook to access authentication context data.
 * Provides easy access to user state, login/logout methods, and status flags.
 */
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider Component
 * Manages the global authentication state of the application. 
 * Handles local storage token persistence, session initialization, 
 * and provides state across the component tree.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    /**
     * Session Initialization Logic
     * Runs on application mount. Checks for an existing 'user_token' in localStorage.
     * If valid, attempts to fetch current user data to restore the session.
     */
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('user_token');
            if (token) {
                try {
                    const userData = await api.fetchUser(); 
                    setUser(userData);
                } catch (error) {
                    console.error('Token invalid or expired. Logging out.');
                    localStorage.removeItem('user_token');
                }
            }
            setIsLoading(false);
        };
        loadUser();
    }, []);

    /**
     * User Login Method
     * Authenticates credentials via API, persists the received token to 
     * localStorage, and updates the global user state with specific role data.
     */
    const login = async (email, password) => { 
        const credentials = { email, password };
        
        const response = await api.login(credentials);
        localStorage.setItem('user_token', response.token);
        
        const userWithRole = { 
            ...response.user, 
            role: response.user.role 
        };
        
        setUser(userWithRole);
        return userWithRole; 
    };

    /**
     * User Registration Method
     * Dispatches user details to the API, saves the generated token,
     * and initializes the session as a standard customer.
     */
    const register = async (userData) => {
        const response = await api.register(userData);
        localStorage.setItem('user_token', response.token);
        
        const userWithRole = { ...response.user, role: 'customer' };
        
        setUser(userWithRole);
        navigate('/'); 
    };

    /**
     * Session Termination Method
     * Informs the backend of the session ending, clears current local credentials,
     * resets application state, and redirects the user to the login screen.
     */
    const logout = async () => {
        try {
            await api.logout();
        } catch (error) {
        } finally {
            localStorage.removeItem('user_token');
            setUser(null);
            navigate('/login');
        }
    };

    const value = {
        user,
        setUser, 
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
        isAdmin: user?.role === 'admin', 
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};