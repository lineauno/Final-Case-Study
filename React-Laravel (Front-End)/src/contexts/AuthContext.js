import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

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

    const login = async (email, password, userType) => {
        const credentials = { email, password, userType };
        
        const response = await api.login(credentials);
        localStorage.setItem('user_token', response.token);
        
        const userWithRole = { 
            ...response.user, 
            role: response.user.role || (email.toLowerCase().includes('admin') ? 'admin' : 'customer') 
        };
        
        setUser(userWithRole);
        navigate('/'); 
    };

    const register = async (userData) => {
        const response = await api.register(userData);
        localStorage.setItem('user_token', response.token);
        
        const userWithRole = { ...response.user, role: 'customer' };
        
        setUser(userWithRole);
        navigate('/'); 
    };

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