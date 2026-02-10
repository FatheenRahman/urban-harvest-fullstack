import axios from 'axios';

const API_URL = 'https://urban-harvest-fullstack-production.up.railway.app/api';
// const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
console.log("URBAN HARVEST API URL (Hardcoded):", API_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
