import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Al cargar, revisamos si hay un correo recordado previamente
  useEffect(() => {
    const correoGuardado = localStorage.getItem('correo_recordado');
    if (correoGuardado) {
      setEmail(correoGuardado);
      setRememberMe(true);
    }
  }, []);

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
        
        // AQUÍ GUARDAMOS EL ROL QUE AHORA SÍ ENVÍA EL BACKEND
        localStorage.setItem('usuario_rol', response.data.usuario.rol); 
        
        // Manejo de la opción Recordar Contraseña
        if (rememberMe) {
          localStorage.setItem('correo_recordado', email);
        } else {
          localStorage.removeItem('correo_recordado');
        }
        
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
      
      <div className="bg-white rounded-[32px] p-10 w-full max-w-[450px] shadow-2xl relative overflow-hidden">
        
        {/* NUEVA IDENTIDAD: SISTEMA DE VENTAS CONTAWAR */}
        <div className="text-center mb-10 mt-2">
          
          {/* Logo Tipográfico Moderno */}
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-12 h-12 bg-[#ffc107] rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
              <span className="text-[#152D57] font-black text-2xl -rotate-3">C</span>
            </div>
            <h1 className="text-4xl font-black text-[#152D57] tracking-tight">
              CONTA<span className="text-[#ffc107]">WAR</span>
            </h1>
          </div>
          
          <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-4">
            Sistema de Ventas y Cobranzas
          </p>
          
          <h2 className="text-xl font-bold text-slate-800 mb-1">Inicio de Sesión</h2>
          <p className="text-slate-500 text-sm font-medium">Ingresa tus credenciales de acceso</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          
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
              placeholder="Ej. admin@estructuratech.com"
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
                ¿Olvidó su contraseña?
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
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-[#152D57] focus:ring-[#152D57] cursor-pointer"
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

      </div>
    </div>
  );
}