import { useState, useEffect } from 'react';
import { AlertCircle, Phone, MapPin, Eye } from 'lucide-react';
import api from '../services/api';

interface ClienteMora {
  id: string;
  nombre_completo: string;
  documento_identidad: string;
  telefono: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  dias_mora: number;
}

export default function ClientesEnMora() {
  const [clientesMora, setClientesMora] = useState<ClienteMora[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarMora = async () => {
      setIsLoading(true);
      try {
        const respuesta = await api.get('/clientes/mora');
        setClientesMora(respuesta.data.datos || []);
      } catch (error) {
        console.error("Error al cargar clientes en mora:", error);
      } finally {
        setIsLoading(false);
      }
    };
    cargarMora();
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto font-sans pb-10 mt-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-[26px] font-bold text-white tracking-wide flex items-center gap-2">
            <AlertCircle className="text-red-500" size={28} /> Clientes en Mora
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {clientesMora.length} clientes con pagos atrasados registrados.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      ) : clientesMora.length === 0 ? (
        <div className="bg-[#242e42] rounded-xl p-10 text-center border border-gray-700/20 shadow-md">
          <AlertCircle size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">¡Excelente noticia!</h3>
          <p className="text-gray-400">No hay clientes en mora en este momento.</p>
        </div>
      ) : (
        <div className="bg-[#242e42] rounded-2xl shadow-xl border border-gray-700/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#1e2738] text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-700/50">
                  <th className="p-4">Cédula</th>
                  <th className="p-4">Nombre Completo</th>
                  <th className="p-4">Celular</th>
                  <th className="p-4">Dirección / Barrio</th>
                  <th className="p-4 text-center">Estado de Retraso</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30 text-sm text-white">
                {clientesMora.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-[#1e2738]/50 transition-colors">
                    <td className="p-4 text-gray-300 font-medium">{cliente.documento_identidad}</td>
                    <td className="p-4 font-bold uppercase">{cliente.nombre_completo}</td>
                    <td className="p-4 text-gray-300 flex items-center gap-1.5 pt-5">
                      <Phone size={14} className="text-[#ffc107]" /> {cliente.telefono}
                    </td>
                    <td className="p-4 text-gray-300">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-red-400 shrink-0" />
                        <span className="uppercase">{cliente.direccion}</span>
                      </div>
                      <span className="text-xs text-gray-500">Barrio: {cliente.barrio || 'N/A'}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold">
                        {cliente.dias_mora} {cliente.dias_mora === 1 ? 'día de atraso' : 'días de atraso'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => alert(`Contactar a ${cliente.nombre_completo}`)}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-xl transition"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}