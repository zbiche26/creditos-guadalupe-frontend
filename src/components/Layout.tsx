import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
// Agregamos el icono LogOut a la lista de importaciones
import { LayoutGrid, Users, TrendingUp, DollarSign, Coins, Map, Calendar, Settings, Search, Bell, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [clientesOpen, setClientesOpen] = useState(true);
  const [nombreUsuario, setNombreUsuario] = useState('Administrador');

  // NUEVO: Estado para controlar si el menú del perfil está abierto o cerrado
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const emailGuardado = localStorage.getItem('usuario_email');
    if (emailGuardado) {
      const nombre = emailGuardado.split('@')[0];
      setNombreUsuario(nombre.charAt(0).toUpperCase() + nombre.slice(1));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_email');
    navigate('/login');
  };

  const isClientesActive = location.pathname.includes('/clientes');

  return (
    <div className="flex h-screen bg-[#1A2235] text-guadalupe-blanco overflow-hidden font-sans">

      {/* Barra Lateral Izquierda */}
      <aside className="w-[260px] bg-guadalupe-azul flex flex-col z-20 shadow-2xl overflow-y-auto">
        <div className="pt-8 pb-8 px-6 text-center flex justify-center">
          <img src={logo} alt="Logo" className="w-36 h-auto object-contain" />
        </div>

        <nav className="flex-1 flex flex-col gap-1.5 py-2">
          {/* Panel */}
          <div>
            <Link
              to="/dashboard"
              className={`flex items-center gap-4 py-3.5 pl-8 pr-4 w-11/12 rounded-r-2xl transition-all ${
                location.pathname.includes('/dashboard')
                  ? 'bg-guadalupe-amarillo text-guadalupe-azul font-bold shadow-lg'
                  : 'text-guadalupe-blanco/70 hover:text-guadalupe-blanco hover:bg-white/5 font-medium'
              }`}
            >
              <LayoutGrid size={20} />
              <span className="text-sm">Panel</span>
            </Link>
          </div>

          {/* Menú Desplegable de Clientes */}
          <div>
            <button
              onClick={() => setClientesOpen(!clientesOpen)}
              className={`w-11/12 flex items-center justify-between py-3.5 pl-8 pr-4 rounded-r-2xl transition-all ${
                isClientesActive
                  ? 'bg-guadalupe-amarillo text-guadalupe-azul font-bold shadow-lg'
                  : 'text-guadalupe-blanco/70 hover:text-guadalupe-blanco hover:bg-white/5 font-medium'
              }`}
            >
              <div className="flex items-center gap-4">
                <Users size={20} fill="currentColor" />
                <span className="text-sm">Clientes</span>
              </div>
              {clientesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {clientesOpen && (
              <ul className="pl-14 pr-4 py-2 space-y-1 border-l border-white/10 ml-6 mt-1">
                <li>
                  <Link
                    to="/clientes"
                    className={`block py-2 px-3 rounded-lg text-sm transition ${
                      location.pathname === '/clientes' ? 'text-guadalupe-amarillo font-bold' : 'text-guadalupe-blanco/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Clientes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/clientes/nuevos"
                    className={`block py-2 px-3 rounded-lg text-sm transition ${
                      location.pathname.includes('/nuevos') ? 'text-guadalupe-amarillo font-bold' : 'text-guadalupe-blanco/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Clientes Nuevos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/clientes/actualizar"
                    className={`block py-2 px-3 rounded-lg text-sm transition ${
                      location.pathname.includes('/actualizar') ? 'text-guadalupe-amarillo font-bold' : 'text-guadalupe-blanco/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    Actualizar Datos
                  </Link>
                </li>
              </ul>
            )}
          </div>

          {/* Resto de Opciones del Menú */}
          {[
            { path: '/ventas', label: 'Ventas', icon: <TrendingUp size={20} /> },
            { path: '/gastos', label: 'Gastos', icon: <DollarSign size={20} /> },
            { path: '/totalizar-ventas', label: 'Totalizar Ventas', icon: <Coins size={20} /> },
            { path: '/enrutar', label: 'Enrutar Clientes', icon: <Map size={20} /> },
            { path: '/calendario', label: 'Calendario', icon: <Calendar size={20} /> },
            { path: '/configuracion', label: 'Configuración', icon: <Settings size={20} /> },
          ].map((item) => (
            <div key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-4 py-3.5 pl-8 pr-4 w-11/12 rounded-r-2xl transition-all ${
                  location.pathname.includes(item.path)
                    ? 'bg-guadalupe-amarillo text-guadalupe-azul font-bold shadow-lg'
                    : 'text-guadalupe-blanco/70 hover:text-guadalupe-blanco hover:bg-white/5 font-medium'
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            </div>
          ))}
        </nav>
      </aside>

      {/* Contenedor Principal */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        <header className="h-[76px] flex items-center justify-between px-8 bg-guadalupe-azul border-b border-white/5 shadow-sm z-10">
          <div className="relative w-[360px]">
            <Search className="absolute left-4 top-2.5 text-guadalupe-blanco/40" size={18} />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full bg-white/10 text-guadalupe-blanco px-12 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-guadalupe-amarillo border border-transparent placeholder-guadalupe-blanco/50 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-6 relative">
            <div className="relative cursor-pointer text-guadalupe-blanco/70 hover:text-white transition">
              <Bell size={22} fill="currentColor" />
              <span className="absolute -top-1 -right-1 bg-[#ef4444] text-[10px] font-bold text-white rounded-full h-[18px] w-[18px] flex items-center justify-center border-2 border-guadalupe-azul">6</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer bg-white/10 px-4 py-1.5 rounded-full border border-white/5 hover:bg-white/20 transition">
              <img src="https://flagcdn.com/w20/es.png" alt="ES" className="w-5 h-5 rounded-full object-cover" />
              <span className="text-sm font-semibold text-guadalupe-blanco flex items-center gap-1">Español <ChevronDown size={14} /></span>
            </div>

            {/* SECCIÓN DEL PERFIL CORREGIDA */}
            <div className="relative">
              <div
                className="flex items-center gap-3 cursor-pointer group px-2 py-1 rounded-lg hover:bg-white/5 transition-colors"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-white/20 bg-orange-100">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${nombreUsuario}&backgroundColor=ffdfbf`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-bold leading-tight text-white">{nombreUsuario}</p>
                  <p className="text-[11px] text-guadalupe-blanco/70">Admin</p>
                </div>
                <ChevronDown size={14} className="text-gray-400 group-hover:text-white transition-colors" />
              </div>

              {/* Menú Desplegable que aparece al hacer clic */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-[#242e42] rounded-xl shadow-xl py-2 border border-gray-700 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={16} /> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Área dinámica */}
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}