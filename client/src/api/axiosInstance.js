import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Karena kita sudah set proxy di vite.config.js
    headers: {
        'Content-Type': 'application/json'
    }
});

// --- INTERCEPTOR (Pencegat) ---
// Sebelum request dikirim, cek apakah ada token di localStorage?
// Kalau ada, tempelkan token itu ke Header "Authorization".
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;