import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Untuk pindah halaman
import api from '../api/axiosInstance'; // Axios yang sudah kita setting

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. Cek Login saat website pertama kali dibuka (Refresh)
    useEffect(() => {
        const checkLogin = () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (token && savedUser) {
                // Kembalikan data user dari penyimpanan lokal
                setUser(JSON.parse(savedUser));
            }
            setLoading(false);
        };
        checkLogin();
    }, []);

    // 2. Fungsi Login
    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            
            // Simpan token & data user ke browser
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            setUser(res.data.user); // Update state global
            
            // Redirect sesuai role (Opsional, kita lempar ke dashboard dulu)
            navigate('/dashboard'); 
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login gagal' 
            };
        }
    };

    // 3. Fungsi Register
    const register = async (name, email, password, role) => {
        try {
            await api.post('/auth/register', { name, email, password, role });
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registrasi gagal' 
            };
        }
    };

    // 4. Fungsi Logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom Hook biar manggilnya gampang: const { user } = useAuth();
export const useAuth = () => useContext(AuthContext);