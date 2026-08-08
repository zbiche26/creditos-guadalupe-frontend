import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import api from '../services/api'; // <-- Importamos nuestro puente de comunicación

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // <-- Nuevo estado para mostrar errores
  const [isLoading, setIsLoading] = useState(false); // <-- Estado para el botón de carga
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Hacemos la petición real a FastAPI (asumiendo que tu endpoint es /login o /token)
      // Ajusta la ruta '/login' según cómo la hayas definido en tu main.py
      const response = await api.post('/login', {
        email: email,
        password: password
      });

      // Si el backend responde bien, guardamos el token (si aplica) y vamos al dashboard
      console.log("Respuesta del servidor:", response.data);
      // localStorage.setItem('token', response.data.token);

      navigate('/dashboard');
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      // Si FastAPI devuelve un error (ej. credenciales inválidas), lo mostramos
      setError('Correo o contraseña incorrectos. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c1928] flex items-center justify-center p-4">
      <div className="bg-[#13253b] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#1e3a5f]">

        <div className="text-center mb-8">
          <img src={logo} alt="Logo Créditos Guadalupe" className="w-40 h-auto mx-auto mb-2 rounded-lg" />
          <h2 className="text-xl font-serif text-white tracking-wide mt-4">Panel Gerencial</h2>
          <p className="text-gray-400 mt-1 text-sm">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Mensaje de Error en pantalla */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-[#0c1928] text-white border border-[#1e3a5f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d59d47] focus:border-transparent transition placeholder-gray-600"
              placeholder="admin@guadalupe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 bg-[#0c1928] text-white border border-[#1e3a5f] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d59d47] focus:border-transparent transition placeholder-gray-600"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-[#0c1928] font-bold py-3 px-4 rounded-lg transition duration-300 shadow-lg mt-4 ${
              isLoading ? 'bg-[#b3833b] cursor-not-allowed' : 'bg-[#d59d47] hover:bg-[#eeb153]'
            }`}
          >
            {isLoading ? 'Verificando...' : 'Ingresar al Sistema'}
          </button>

        </form>
      </div>
    </div>
  );
}