import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutGrid, Users, TrendingUp, DollarSign, Coins, Map, Calendar, Settings, Search, Bell, ChevronDown, ChevronRight, LogOut, AlertCircle, CreditCard } from 'lucide-react';
import logo from '../assets/logo.png';
import api from '../services/api';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [clientesOpen, setClientesOpen] = useState(true);
  const [nombreUsuario, setNombreUsuario] = useState('Administrador');
  const [profileOpen, setProfileOpen] = useState(false);

  // Estados para el Buscador Global
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState<any[]>([]);
  const [showResultados, setShowResultados] = useState(false);

  // Estados para Notificaciones
  const [notifOpen, setNotifOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState<any[]>([]);

  useEffect(() => {
    const emailGuardado = localStorage.getItem('usuario_email');
    if (emailGuardado) {
      const nombre = emailGuardado.split('@')[0];
      setNombreUsuario(nombre.charAt(0).toUpperCase() + nombre.slice(1));
    }

    const cargarNotificaciones = async () => {
      try {
        const respuesta = await api.get('/clientes/');
        const listaClientes = respuesta.data.datos || [];
        setNotificaciones(listaClientes.slice(-4).reverse());
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      }
    };
    cargarNotificaciones();
  }, []);

  const handleBusquedaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setTerminoBusqueda(valor);

    if (valor.trim().length > 1) {
      try {
        const respuesta = await api.get('/clientes/');
        const clientes = respuesta.data.datos || [];
        const filtrados = clientes.filter((c: any) => 
          c.nombre_completo.toLowerCase().includes(valor.toLowerCase()) ||
          c.documento_identidad.includes(valor)
        );
        setResultadosBusqueda(filtrados);
        setShowResultados(true);
      } catch (error) {
        console.error("Error buscando:", error);
      }
    } else {
      setResultadosBusqueda([]);
      setShowResultados(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario_email');
    navigate('/login');
  };

  const isClientesActive = location.pathname.includes('/clientes') || location.pathname.includes('/creditos');

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
                <li>
                  <Link
                    to="/clientes/mora"
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition ${
                      location.pathname.includes('/mora') ? 'text-guadalupe-amarillo font-bold' : 'text-guadalupe-blanco/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <AlertCircle size={14} className="text-red-500" />
                    <span>Clientes en Mora</span>
                  </Link>
                </li>
                {/* NUEVO MÓDULO: Historial Global de Créditos */}
                <li>
                  <Link
                    to="/creditos/historial"
                    className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm transition ${
                      location.pathname.includes('/creditos/historial') ? 'text-guadalupe-amarillo font-bold' : 'text-guadalupe-blanco/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <CreditCard size={14} className="text-[#ffc107]" />
                    <span>Historial Créditos</span>
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

        <header className="h-[76px] flex items-center justify-between px-8 bg-guadalupe-azul border-b border-white/5 shadow-sm z-30">
          
          {/* 1. BUSCADOR GLOBAL FUNCIONAL */}
          <div className="relative w-[360px]">
            <Search className="absolute left-4 top-2.5 text-guadalupe-blanco/40" size={18} />
            <input
              type="text"
              placeholder="Buscar cliente por nombre o cédula..."
              value={terminoBusqueda}
              onChange={handleBusquedaChange}
              onFocus={() => { if (terminoBusqueda.trim().length > 1) setShowResultados(true); }}
              className="w-full bg-white/10 text-guadalupe-blanco text-xs px-12 py-2 rounded-full focus:outline-none focus:ring-1 focus:ring-guadalupe-amarillo border border-transparent placeholder-guadalupe-blanco/50 shadow-sm"
            />

            {/* Ventana flotante de resultados del buscador */}
            {showResultados && (
              <div className="absolute left-0 mt-2 w-full bg-[#242e42] border border-gray-700 rounded-2xl shadow-2xl py-2 px-3 z-50 max-h-60 overflow-y-auto">
                <p className="text-[10px] uppercase font-bold text-gray-400 px-2 mb-1">Resultados de Clientes</p>
                {resultadosBusqueda.length === 0 ? (
                  <p className="text-xs text-gray-400 px-2 py-2 text-center">No se encontraron clientes.</p>
                ) : (
                  resultadosBusqueda.map((c: any) => (
                    <div 
                      key={c.id} 
                      onClick={() => {
                        setShowResultados(false);
                        setTerminoBusqueda('');
                        navigate('/clientes');
                      }}
                      className="p-2 hover:bg-white/5 rounded-xl cursor-pointer transition text-xs border-b border-gray-700/50 last:border-none"
                    >
                      <p className="font-bold text-white">{c.nombre_completo}</p>
                      <p className="text-gray-400 text-[10px]">Cédula: {c.documento_identidad}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 relative">
            
            {/* 2. NOTIFICACIONES INTERACTIVAS (CAMPANITA) */}
            <div className="relative">
              <div 
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative cursor-pointer text-guadalupe-blanco/70 hover:text-white transition p-1"
              >
                <Bell size={22} fill="currentColor" />
                {notificaciones.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ef4444] text-[10px] font-bold text-white rounded-full h-[18px] w-[18px] flex items-center justify-center border-2 border-guadalupe-azul animate-pulse">
                    {notificaciones.length}
                  </span>
                )}
              </div>

              {/* Menú desplegable de notificaciones */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-[#242e42] border border-gray-700 rounded-2xl shadow-2xl py-3 px-4 z-50">
                  <h4 className="text-xs font-bold uppercase text-gray-400 mb-2 border-b border-gray-700 pb-1 flex justify-between items-center">
                    <span>Notificaciones Recientes</span>
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notificaciones.map((n, i) => (
                      <div key={i} className="bg-[#151c2c] p-2.5 rounded-xl border border-gray-700/50 text-xs">
                        <p className="font-semibold text-guadalupe-amarillo">Cliente Registrado</p>
                        <p className="text-white font-medium truncate">{n.nombre_completo}</p>
                        <p className="text-[10px] text-gray-400">CC: {n.documento_identidad}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 3. SELECTOR DE PAÍS E IDIOMA (COLOMBIA 🇨🇴) */}
            <div className="flex items-center gap-2 cursor-pointer bg-white/10 px-4 py-1.5 rounded-full border border-white/5 hover:bg-white/20 transition">
              <img src="https://flagcdn.com/w20/co.png" alt="CO" className="w-5 h-4 rounded-sm object-cover shadow-sm" />
              <span className="text-sm font-semibold text-guadalupe-blanco flex items-center gap-1">Colombia <ChevronDown size={14} /></span>
            </div>

            {/* SECCIÓN DEL PERFIL */}
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

              {/* Menú Desplegable del Perfil */}
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