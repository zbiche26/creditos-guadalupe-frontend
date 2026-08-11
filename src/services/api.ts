import axios from 'axios';

// Creamos la instancia
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor activado: Antes de salir cualquier petición, le pegamos el token
api.interceptors.request.use(
  (config) => {
    // Buscamos el token que guardamos durante el Login
    const token = localStorage.getItem('token');

    // Si existe, lo inyectamos en la cabecera de autorización
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;