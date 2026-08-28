import { useState, useEffect } from 'react';
import { Search, Plus, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface VentaGlobal {
  id: string;
  consecutivo: number;
  nombre_cliente: string;
  nombre_completo?: string;
  documento: string;
  telefono: string;
  monto_prestado: number;
  monto_total_pagar: number;
  saldo_restante: number;
  modalidad: string;
  estado: string;
  created_at: string;
}

export default function Ventas() {
  const [ventas, setVentas] = useState<VentaGlobal[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarVentas = async () => {
      setIsLoading(true);
      try {
        const respuesta = await api.get('/creditos/historial-global');
        setVentas(respuesta.data.datos || []);
      } catch (error) {
        console.error("Error al cargar las ventas:", error);
      } finally {
        setIsLoading(false);
      }
    };
    cargarVentas();
  }, []);

  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(monto || 0);
  };

  const formatearFecha = (fechaIso: string) => {
    if (!fechaIso) return 'N/A';
    const fecha = new Date(fechaIso);
    return isNaN(fecha.getTime()) ? 'N/A' : fecha.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Filtrado seguro usando nombre_cliente
  const ventasFiltradas = ventas.filter(venta => 
    venta.nombre_cliente?.toLowerCase().includes(busqueda.toLowerCase()) || 
    venta.documento?.includes(busqueda) ||
    venta.consecutivo?.toString().includes(busqueda)
  );

  return (
    <div className="w-full max-w-[1400px] mx-auto font-sans pb-10 mt-2">
      
      {/* Encabezado: Título y Botón de Crear Venta */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="text-[#ffc107]" size={32} /> Listado de Créditos
          </h1>
          <p className="text-gray-400 mt-2">Historial de todas las ventas y préstamos activos del sistema.</p>
        </div>

        <Link 
          to="/ventas/crear" 
          className="bg-[#ffc107] hover:bg-[#e0a800] text-[#111927] font-extrabold px-6 py-3 rounded-xl transition shadow-lg flex items-center gap-2 uppercase tracking-widest text-sm"
        >
          <Plus size={18} /> Crear Venta
        </Link>
      </div>

      {/* Contenedor Principal (Tarjeta Oscura) */}
      <div className="bg-[#242e42] rounded-2xl shadow-xl border border-gray-700/30 overflow-hidden">
        
        {/* Barra de Búsqueda Integrada */}
        <div className="p-6 border-b border-gray-700/50 bg-[#1e2738]/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar por # crédito, cliente o cédula..."
              className="w-full bg-[#151c2c] text-white px-12 py-3 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ffc107] transition text-xs"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Tabla de Datos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1e2738] border-b border-gray-700/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-5 font-bold text-center">Crédito #</th>
                <th className="p-5 font-bold">Cliente</th>
                <th className="p-5 font-bold">Cédula</th>
                <th className="p-5 font-bold">Valor Prestado</th>
                <th className="p-5 font-bold">Total a Pagar</th>
                <th className="p-5 font-bold">Saldo Restante</th>
                <th className="p-5 font-bold">Fecha</th>
                <th className="p-5 font-bold">Modalidad</th>
                <th className="p-5 font-bold text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-gray-400">
                    <div className="flex justify-center mb-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#ffc107]"></div>
                    </div>
                    Cargando créditos...
                  </td>
                </tr>
              ) : ventasFiltradas.length > 0 ? (
                ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5 text-center font-extrabold text-[#ffc107]">
                      #{venta.consecutivo}
                    </td>
                    <td className="p-5 text-white font-bold whitespace-nowrap uppercase">
                      {venta.nombre_cliente || 'Sin Nombre'}
                    </td>
                    <td className="p-5 text-gray-300">
                      {venta.documento || 'N/A'}
                    </td>
                    <td className="p-5 font-semibold text-gray-200">
                      {formatearDinero(venta.monto_prestado)}
                    </td>
                    <td className="p-5 font-semibold text-amber-400">
                      {formatearDinero(venta.monto_total_pagar)}
                    </td>
                    <td className="p-5 font-bold text-red-400">
                      {formatearDinero(venta.saldo_restante)}
                    </td>
                    <td className="p-5 text-gray-400 text-xs">
                      {formatearFecha(venta.created_at)}
                    </td>
                    <td className="p-5">
                      <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {venta.modalidad || 'DIARIO'}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      {venta.estado === 'ACTIVO' ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          <CheckCircle2 size={14} /> Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          <AlertCircle size={14} /> {venta.estado}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-10 text-center text-gray-400">
                    No se encontraron créditos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pie de tabla */}
        <div className="p-4 border-t border-gray-700/50 bg-[#1e2738]/30 text-xs text-gray-500 flex justify-between items-center">
          <span>Mostrando {ventasFiltradas.length} resultados</span>
        </div>

      </div>
    </div>
  );
}