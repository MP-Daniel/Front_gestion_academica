// Cliente HTTP central configurado con Axios e interceptores para el token JWT

import axios from 'axios';
import { useAuthStore } from '../store/auth.store';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Interceptor de REQUEST: mete el token en cada petición automáticamente

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Interceptor de RESPONSE: maneja errores globalmente

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().cerrarSesion();
            window.location.href = '/login';
        }
        if (error.response?.status === 403) {
            window.location.href = '/no-autorizado';
        }
        return Promise.reject(error);
    }
);

export default api;
