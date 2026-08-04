import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos la imagen que acabas de guardar
import logo from '../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    // Fondo principal tomando el color azul oscuro del logo
    <div className="min-h-screen bg-[#0c1928] flex items-center justify-center p-4">

      {/* Tarjeta central ligeramente más clara para hacer contraste */}
      <div className="bg-[#13253b] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#1e3a5f]">

        {/* Encabezado con el Logo integrado */}
        <div className="text-center mb-8">
          <img
            src={logo}
            alt="Logo Créditos Guadalupe"
            className="w-40 h-auto mx-auto mb-2 rounded-lg"
          />
          <h2 className="text-xl font-serif text-white tracking-wide mt-4">Panel Gerencial</h2>
          <p className="text-gray-400 mt-1 text-sm">Ingresa tus credenciales para continuar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">

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
            className="w-full bg-[#d59d47] text-[#0c1928] font-bold py-3 px-4 rounded-lg hover:bg-[#eeb153] transition duration-300 shadow-lg mt-4"
          >
            Ingresar al Sistema
          </button>

        </form>
      </div>
    </div>
  );
}