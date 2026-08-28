import { useState, useEffect } from 'react';
import { CreditCard, Search, Calendar, User, Phone, X, Check } from 'lucide-react';
import api from '../services/api';

interface CreditoGlobal {
  id: string;
  consecutivo: number;
  nombre_cliente: string;
  documento: string;
  telefono: string;
  monto_prestado: number;
  monto_total_pagar: number;
  saldo_restante: number;
  modalidad: string;
  estado: string;
  created_at: string;
}

export default function HistorialGlobalCreditos() {
  const [creditos, setCreditos] = useState<CreditoGlobal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [fechaFiltro, setFechaFiltro] = useState('');

  useEffect(() => {
    const cargarHistorial = async () => {
      setIsLoading(true);
      try {
        const respuesta = await api.get('/creditos/historial-global');
        if (respuesta.data?.datos) {
          setCreditos(respuesta.data.datos);
        } else if (Array.isArray(respuesta.data)) {
          setCreditos(respuesta.data);
        } else {
          setCreditos([]);
        }
      } catch (error) {
        console.error("Error al cargar historial global:", error);
      } finally {
        setIsLoading(false);
      }
    };
    cargarHistorial();
  }, []);

  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(monto || 0);
  };

  const formatearFecha = (fechaISO?: string) => {
    if (!fechaISO) return 'N/A';
    const fecha = new Date(fechaISO);
    return isNaN(fecha.getTime()) ? 'N/A' : `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
  };

  // Obtener la fecha actual en formato YYYY-MM-DD para botones rápidos
  const obtenerFechaHoy = () => {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  };

  const creditosFiltrados = creditos.filter((c) => {
    const termino = busqueda.toLowerCase().trim();
    const nombre = (c.nombre_cliente || '').toLowerCase();
    const doc = (c.documento || '').toLowerCase();
    const consecutivo = (c.consecutivo || '').toString();
    const coincideTexto = !termino || nombre.includes(termino) || doc.includes(termino) || consecutivo.includes(termino);

    let coincideFecha = true;
    if (fechaFiltro && c.created_at) {
      const fechaCreditoStr = c.created_at.split('T')[0];
      coincideFecha = fechaCreditoStr === fechaFiltro;
    } else if (fechaFiltro && !c.created_at) {
      coincideFecha = false;
    }

    return coincideTexto && coincideFecha;
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto font-sans pb-10 mt-2">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-[26px] font-bold text-white tracking-wide flex items-center gap-2">
            <CreditCard className="text-[#ffc107]" size={28} /> Historial Global de Créditos
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Registro consecutivo de todos los créditos emitidos en la empresa.
          </p>
        </div>

        {/* Controles de Búsqueda y Filtros Modernos */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Barra de Búsqueda */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por # crédito, cliente..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-[#242e42] text-white text-xs px-11 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ffc107] shadow-inner placeholder-gray-500"
            />
          </div>

          {/* Selector de Fecha Moderno Estilizado */}
          <div className="relative flex items-center bg-[#242e42] border border-gray-700 rounded-xl px-3 py-1.5 shadow-inner">
            <Calendar className="text-[#ffc107] mr-2 shrink-0" size={16} />
            <input
              type="date"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer [color-scheme:dark]"
            />
            {fechaFiltro && (
              <button
                onClick={() => setFechaFiltro('')}
                className="ml-2 bg-white/10 hover:bg-white/20 text-gray-300 p-1 rounded-lg transition"
                title="Limpiar fecha"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Botón rápido para filtrar hoy */}
          <button
            onClick={() => setFechaFiltro(obtenerFechaHoy())}
            className={`text-xs font-bold px-3.5 py-2.5 rounded-xl border transition flex items-center gap-1.5 ${
              fechaFiltro === obtenerFechaHoy()
                ? 'bg-[#ffc107] text-[#111927] border-[#ffc107]'
                : 'bg-[#242e42] text-gray-300 border-gray-700 hover:bg-white/5'
            }`}
          >
            <Check size={14} /> Hoy
          </button>
        </div>
      </div>

      <div className="bg-[#242e42] rounded-2xl shadow-xl border border-gray-700/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1e2738] text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-700/50">
                <th className="p-4 text-center">Crédito #</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Cédula / Teléfono</th>
                <th className="p-4 text-center">Modalidad</th>
                <th className="p-4 text-right">Prestado</th>
                <th className="p-4 text-right">Total a Pagar</th>
                <th className="p-4 text-right">Saldo Restante</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30 text-sm text-white">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">Cargando historial global...</td>
                </tr>
              ) : creditosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400">No se encontraron créditos registrados con los filtros seleccionados.</td>
                </tr>
              ) : (
                creditosFiltrados.map((credito) => (
                  <tr key={credito.id} className="hover:bg-[#1e2738]/50 transition-colors">
                    <td className="p-4 text-center font-extrabold text-[#ffc107]">
                      #{credito.consecutivo}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User size={15} className="text-gray-400 shrink-0" />
                        <span className="font-bold uppercase">{credito.nombre_cliente}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">
                      <p className="font-medium">{credito.documento}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone size={11} /> {credito.telefono}
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-md text-xs font-semibold">
                        {credito.modalidad}
                      </span>
                    </td>
                    <td className="p-4 text-right font-semibold text-gray-300">
                      {formatearDinero(credito.monto_prestado)}
                    </td>
                    <td className="p-4 text-right font-semibold text-amber-400">
                      {formatearDinero(credito.monto_total_pagar)}
                    </td>
                    <td className="p-4 text-right font-bold text-red-400">
                      {formatearDinero(credito.saldo_restante)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        credito.estado === 'ACTIVO' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-700/30 text-gray-400 border-gray-600/30'
                      }`}>
                        {credito.estado}
                      </span>
                    </td>
                    <td className="p-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1 pt-6">
                      <Calendar size={13} /> {formatearFecha(credito.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}