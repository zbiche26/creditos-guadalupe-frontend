import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, TrendingUp, DollarSign, Coins, Map, Calendar, Settings, Search, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Estado para expandir o contraer el submenú de clientes
  const [clientesOpen, setClientesOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isClientesActive = location.pathname.includes('/clientes');

  return (
    <div className="flex h-screen bg-[#151C2C] text-white overflow-hidden font-sans">

      {/* Barra Lateral Izquierda */}
      <aside className="w-[260px] bg-[#101624] flex flex-col z-20 shadow-2xl overflow-y-auto">

        <div className="pt-8 pb-6 px-6 text-center flex justify-center">
          <img src={logo} alt="Logo" className="w-36 h-auto object-contain" />
        </div>

        <nav className="flex-1 py-2 space-y-1">
          {/* Panel */}
          <div className="px-4">
            <Link
              to="/dashboard"
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                location.pathname.includes('/dashboard')
                  ? 'bg-[#ffc107] text-white font-bold shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-[#1A2235] font-medium'
              }`}
            >
              <LayoutGrid size={20} />
              <span className="text-sm">Panel</span>
            </Link>
          </div>

          {/* Menú Desplegable de Clientes */}
          <div className="px-4">
            <button
              onClick={() => setClientesOpen(!clientesOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isClientesActive
                  ? 'text-white font-bold bg-[#1A2235]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1A2235] font-medium'
              }`}
            >
              <div className="flex items-center gap-4">
                <Users size={20} fill="currentColor" />
                <span className="text-sm">Clientes</span>
              </div>
              {clientesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Submenús de Clientes */}
            {clientesOpen && (
              <ul className="pl-11 pr-2 py-1 space-y-1 mt-1 border-l border-gray-700/40 ml-6">
                <li>
                  <Link
                    to="/clientes"
                    className={`block py-2 px-3 rounded-lg text-xs transition ${
                      location.pathname === '/clientes' ? 'text-[#ffc107] font-bold bg-[#151c2c]' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Clientes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/clientes/nuevos"
                    className={`block py-2 px-3 rounded-lg text-xs transition ${
                      location.pathname.includes('/nuevos') ? 'text-[#ffc107] font-bold bg-[#151c2c]' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Clientes Nuevos
                  </Link>
                </li>
                <li>
                  <Link
                    to="/clientes/actualizar"
                    className={`block py-2 px-3 rounded-lg text-xs transition ${
                      location.pathname.includes('/actualizar') ? 'text-[#ffc107] font-bold bg-[#151c2c]' : 'text-gray-400 hover:text-white'
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
            { path: '/totalizar', label: 'Totalizar Ventas', icon: <Coins size={20} /> },
            { path: '/enrutar', label: 'Enrutar Clientes', icon: <Map size={20} /> },
            { path: '/calendario', label: 'Calendario', icon: <Calendar size={20} /> },
            { path: '/configuracion', label: 'Configuración', icon: <Settings size={20} /> },
          ].map((item) => (
            <div key={item.path} className="px-4">
              <Link
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  location.pathname.includes(item.path)
                    ? 'bg-[#ffc107] text-white font-bold shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-[#1A2235] font-medium'
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
        <header className="h-[76px] flex items-center justify-between px-8 bg-[#151C2C]">
          <div className="relative w-[360px]">
            <Search className="absolute left-4 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full bg-[#1E2638] text-gray-200 px-12 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-[#ffc107] border border-transparent placeholder-gray-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer text-gray-400 hover:text-white transition">
              <Bell size={22} fill="currentColor" />
              <span className="absolute -top-1 -right-1 bg-[#ef4444] text-[10px] font-bold text-white rounded-full h-[18px] w-[18px] flex items-center justify-center border-2 border-[#151C2C]">6</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer bg-[#1E2638] px-4 py-1.5 rounded-full border border-gray-700/50">
              <img src="https://flagcdn.com/w20/es.png" alt="ES" className="w-5 h-5 rounded-full object-cover" />
              <span className="text-sm font-semibold text-gray-300 flex items-center gap-1">Español <ChevronDown size={14} /></span>
            </div>

            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleLogout}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-gray-600 bg-orange-100">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffdfbf" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-bold leading-tight text-white">Juan López</p>
                <p className="text-[11px] text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}