import { createContext, useContext, useState, useCallback } from 'react';
import { API_BASE_URL } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('doctorAppUser');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                return { ...parsed, id: parsed._id };
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.removeItem('doctorAppUser');
            }
        }
        return null;
    });
    const [loading] = useState(false); // No longer needs initial loading state as we check synchronously

    const login = (userData) => {
        // userData should include { _id, name, role, email, token }
        const userWithId = { ...userData, id: userData._id };
        setUser(userWithId);
        localStorage.setItem('doctorAppUser', JSON.stringify(userWithId));
        if (userData.token) {
            localStorage.setItem('doctorAppToken', userData.token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('doctorAppUser');
    };

    const updateUser = async (userData) => {
        try {
            const token = localStorage.getItem('doctorAppToken');
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                const userWithId = { ...data, id: data._id };
                setUser(userWithId);
                localStorage.setItem('doctorAppUser', JSON.stringify(userWithId));
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, message: 'Server connection failed' };
        }
    };

    const token = localStorage.getItem('doctorAppToken');

    const value = {
        user,
        token,
        login,
        logout,
        updateUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <div className="text-center p-4">Loading application...</div> : children}
        </AuthContext.Provider>
    );
};
