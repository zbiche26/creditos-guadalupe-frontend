import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/login/', {
        email: email,
        password: password
      });

      if (response.data.token_acceso) {
        localStorage.setItem('token', response.data.token_acceso);
        localStorage.setItem('usuario_email', email); 
        localStorage.setItem('usuario_id', response.data.usuario.id);
        localStorage.setItem('empresa_id', response.data.usuario.empresa_id);
        localStorage.setItem('usuario_rol', response.data.usuario.rol);
        
        navigate('/dashboard');
      } else {
        setError(response.data.detalle || 'Error al iniciar sesión');
      }

    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError('Correo o contraseña incorrectos. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#152D57] p-4 font-sans">
      
      <div className="bg-white rounded-[32px] p-10 w-full max-w-[450px] shadow-2xl">
        
        {/* Logo Circular con el fondo #152D57 */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 bg-[#152D57] rounded-full flex items-center justify-center shadow-inner overflow-hidden">
            <img src={logo} alt="Créditos Guadalupe" className="w-20 h-auto object-contain" />
          </div>
        </div>

        {/* Encabezado */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 mb-1">Inicio de Sesión</h2>
          <p className="text-slate-500 text-sm font-medium">Escriba su correo electrónico</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center border border-red-200 font-medium">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-slate-600 text-sm font-bold mb-2">
              Correo Electrónico:
            </label>
            <input
              type="email"
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#152D57] focus:border-transparent transition"
              placeholder="Ej. jeison_arias@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-slate-600 text-sm font-bold">
                Contraseña
              </label>
              <a href="#" className="text-slate-400 text-xs hover:text-[#152D57] hover:underline transition">
                Olvidó su contraseña?
              </a>
            </div>
            <input
              type="password"
              required
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-lg tracking-widest px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#152D57] focus:border-transparent transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input 
              type="checkbox" 
              id="recordar"
              className="w-4 h-4 rounded border-slate-300 text-[#152D57] focus:ring-[#152D57]"
            />
            <label htmlFor="recordar" className="text-slate-500 text-sm font-medium cursor-pointer">
              Recordar Contraseña
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-4 rounded-xl transition shadow-lg mt-4 flex justify-center items-center ${
              isLoading ? 'bg-[#3e5378] cursor-not-allowed' : 'bg-[#152D57] hover:bg-[#0f203d]'
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              "Ingresar al sistema"
            )}
          </button>

        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-slate-500">No tiene cuenta ? </span>
          <a href="#" className="text-blue-500 font-bold hover:underline">
            Crear cuenta
          </a>
        </div>

      </div>
    </div>
  );
}