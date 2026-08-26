import { useState, useEffect } from 'react';
import { Settings, Shield, Building, Lock, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import api from '../services/api';

export default function Configuracion() {
  const [emailUsuario, setEmailUsuario] = useState('');
  
  // Estados para el formulario de contraseña
  const [passwordActual, setPasswordActual] = useState('');
  const [nuevoPassword, setNuevoPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  useEffect(() => {
    // Recuperar el email del administrador logueado
    const email = localStorage.getItem('usuario_email') || 'admin@guadalupe.com';
    setEmailUsuario(email);
  }, []);

  const handleCambiarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError('');
    setMensajeExito('');

    if (nuevoPassword !== confirmarPassword) {
      setMensajeError('Las contraseñas nuevas no coinciden.');
      return;
    }

    if (nuevoPassword.length < 6) {
      setMensajeError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      await api.put('/usuarios/cambiar-password', {
        email: emailUsuario,
        password_actual: passwordActual,
        nuevo_password: nuevoPassword
      });

      setMensajeExito('¡Tu contraseña ha sido actualizada con éxito!');
      setPasswordActual('');
      setNuevoPassword('');
      setConfirmarPassword('');
      
      // Ocultar mensaje después de 4 segundos
      setTimeout(() => setMensajeExito(''), 4000);
      
    } catch (error: any) {
      setMensajeError(error.response?.data?.detail || "Error al cambiar la contraseña. Verifica tus datos.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto font-sans pb-10 mt-2">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="text-[#ffc107]" size={32} /> Configuración del Sistema
        </h1>
        <p className="text-gray-400 mt-2">Administra los detalles de tu empresa y la seguridad de tu cuenta.</p>
      </div>

      {mensajeExito && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl flex items-center gap-3 mb-6 shadow-sm animate-pulse">
          <CheckCircle2 size={20} /> {mensajeExito}
        </div>
      )}

      {mensajeError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-6 shadow-sm">
          <AlertCircle size={20} /> {mensajeError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TARJETA 1: DATOS DE LA EMPRESA */}
        <div className="flex flex-col shadow-2xl relative h-fit">
          <div className="bg-[#242e42] py-4 px-6 border-b border-gray-700/50 rounded-t-[20px] flex items-center gap-3">
            <Building className="text-blue-400" size={24} />
            <h3 className="text-white font-extrabold text-[16px] uppercase tracking-widest">
              Perfil de Empresa
            </h3>
          </div>

          <div className="bg-[#1e2738] p-8 rounded-b-[20px] text-sm space-y-6">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-[#ffc107]/10 rounded-full flex items-center justify-center border-2 border-[#ffc107]/30">
                <Building className="text-[#ffc107]" size={40} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#151c2c] p-4 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Razón Social</p>
                <p className="text-white font-semibold text-lg">Inversiones Guadalupe</p>
              </div>

              <div className="bg-[#151c2c] p-4 rounded-xl border border-gray-700/50">
                <p className="text-xs text-gray-500 uppercase font-bold mb-1">Administrador Actual</p>
                <p className="text-white font-semibold">{emailUsuario}</p>
                <span className="inline-block mt-2 bg-blue-500/20 text-blue-400 text-[10px] px-2 py-1 rounded-md uppercase font-bold tracking-wider">Permisos Totales</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 text-center italic pt-4">
              * Para modificar la razón social del sistema, contacta a soporte técnico.
            </p>
          </div>
        </div>

        {/* TARJETA 2: SEGURIDAD (CAMBIO DE CONTRASEÑA) */}
        <div className="flex flex-col shadow-2xl relative">
          <div className="bg-[#242e42] py-4 px-6 border-b border-gray-700/50 rounded-t-[20px] flex items-center gap-3">
            <Shield className="text-emerald-400" size={24} />
            <h3 className="text-white font-extrabold text-[16px] uppercase tracking-widest">
              Seguridad de la Cuenta
            </h3>
          </div>

          <div className="bg-[#1e2738] p-8 rounded-b-[20px] text-sm h-full">
            <form onSubmit={handleCambiarPassword} className="space-y-6">
              
              <div className="flex flex-col gap-1.5 pb-2">
                <label className="text-gray-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1">
                  <Lock size={14} /> Contraseña Actual
                </label>
                <input 
                  type="password" 
                  required 
                  value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)}
                  className="bg-[#151c2c] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ffc107] focus:ring-1 focus:ring-[#ffc107] transition" 
                  placeholder="••••••••" 
                />
              </div>

              <div className="flex flex-col gap-1.5 pb-2">
                <label className="text-gray-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1">
                  <Shield size={14} /> Nueva Contraseña
                </label>
                <input 
                  type="password" 
                  required 
                  value={nuevoPassword}
                  onChange={(e) => setNuevoPassword(e.target.value)}
                  className="bg-[#151c2c] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ffc107] focus:ring-1 focus:ring-[#ffc107] transition" 
                  placeholder="••••••••" 
                />
              </div>

              <div className="flex flex-col gap-1.5 pb-4">
                <label className="text-gray-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1">
                  <CheckCircle2 size={14} /> Confirmar Nueva Contraseña
                </label>
                <input 
                  type="password" 
                  required 
                  value={confirmarPassword}
                  onChange={(e) => setConfirmarPassword(e.target.value)}
                  className="bg-[#151c2c] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ffc107] focus:ring-1 focus:ring-[#ffc107] transition" 
                  placeholder="••••••••" 
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#ffc107] hover:bg-[#e0a800] text-[#111927] font-extrabold py-3.5 rounded-xl transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 uppercase tracking-widest mt-4"
              >
                {isLoading ? 'Actualizando...' : <><Save size={20} /> Actualizar Contraseña</>}
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}