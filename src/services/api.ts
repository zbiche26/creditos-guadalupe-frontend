import axios from 'axios';

// Creamos una instancia de axios configurada
const api = axios.create({
  // Vite usa import.meta.env para leer las variables del archivo .env
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de seguridad más adelante
api.interceptors.request.use(
  (config) => {
    // Aquí luego leeremos el token guardado cuando el usuario inicie sesión
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;