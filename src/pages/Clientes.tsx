import { useState, useEffect } from 'react';
import { User, Plus, MapPin, Phone, CreditCard, Eye, X, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Cliente {
  id?: string;
  ruta_id: string;
  nombre_completo: string;
  documento_identidad: string;
  telefono: string;
  direccion: string;
  ciudad?: string;
  correo?: string;
  numero_credito?: string;
  barrio?: string;
  fiador_cedula?: string;
  fiador_nombre?: string;
  fiador_direccion?: string;
  fiador_barrio?: string;
  fiador_contacto?: string;
  created_at?: string;
  estado_credito?: string;
  dias_mora?: number;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  const navigate = useNavigate();

  const fetchClientes = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get('/clientes/');
      if (response.data.datos) {
        setClientes(response.data.datos);
      } else if (Array.isArray(response.data)) {
        setClientes(response.data);
      } else {
        setClientes([]);
      }
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setError("Error al conectar con la base de datos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const formatearFecha = (fechaISO?: string) => {
    if (!fechaISO) return 'N/A';
    const fecha = new Date(fechaISO);
    return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
  };

  const renderEstadoBadge = (estado_credito: string, diasMora: number = 0) => {
    switch (estado_credito) {
      case 'AL_DIA':
        return (
          <span className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-[10px] font-extrabold border border-green-500/30 whitespace-nowrap tracking-wider">
            AL DÍA
          </span>
        );
      case 'MORA':
        return (
          <span className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-[10px] font-extrabold border border-red-500/30 whitespace-nowrap tracking-wider">
            EN MORA ({diasMora} DÍAS)
          </span>
        );
      case 'PROXIMO':
        return (
          <span className="bg-yellow-500/20 text-[#ffc107] px-3 py-1.5 rounded-full text-[10px] font-extrabold border border-[#ffc107]/30 whitespace-nowrap tracking-wider">
            PRÓXIMO A PAGAR
          </span>
        );
      case 'SIN_CREDITO':
      default:
        return (
          <span className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-[10px] font-extrabold border border-blue-500/30 whitespace-nowrap tracking-wider">
            SIN CRÉDITO
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto font-sans pb-10">

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <h2 className="text-[26px] font-bold text-white tracking-wide">Directorio de Clientes</h2>

        <button
          onClick={() => navigate('/clientes/nuevos')}
          className="bg-[#ffc107] text-[#111927] font-bold py-2.5 px-6 rounded-full hover:bg-yellow-400 transition shadow-lg flex items-center gap-2 text-sm"
        >
          <Plus size={18} strokeWidth={3} /> Crear Cliente
        </button>
      </div>

      {/* Tabla Expandida */}
      <div className="bg-[#242e42] rounded-xl overflow-hidden shadow-md border border-gray-700/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-[#1e2738]">
              <tr className="text-[12px] text-gray-400 border-b border-gray-700/30 uppercase tracking-wider">
                <th className="px-5 py-4 font-semibold text-center">NÚMERO</th>
                <th className="px-5 py-4 font-semibold text-center"># CRÉDITO</th>
                <th className="px-5 py-4 font-semibold">CÉDULA</th>
                <th className="px-5 py-4 font-semibold">NOMBRE</th>
                <th className="px-5 py-4 font-semibold">CIUDAD</th>
                <th className="px-5 py-4 font-semibold">DIRECCIÓN</th>
                <th className="px-5 py-4 font-semibold">CELULAR</th>
                <th className="px-5 py-4 font-semibold text-center">ESTADO</th>
                <th className="px-5 py-4 font-semibold text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400 font-medium">Cargando directorio...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-red-400 font-medium">{error}</td>
                </tr>
              ) : clientes.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400 font-medium">Aún no hay clientes registrados.</td>
                </tr>
              ) : (
                clientes.map((cliente, index) => {
                  const estadoMostrar = cliente.estado_credito || 'SIN_CREDITO';
                  const diasMoraMostrar = cliente.dias_mora || 0;

                  // Lógica limpia para mostrar el número de crédito o asignar un consecutivo si está vacío
                  const mostrarCredito = cliente.numero_credito && cliente.numero_credito !== 'N/A' && cliente.numero_credito !== '0' && cliente.numero_credito !== 'SIN CRÉDITO'
                    ? cliente.numero_credito
                    : (estadoMostrar !== 'SIN_CREDITO' ? `CRD-${(index + 1).toString().padStart(3, '0')}` : 'Sin Crédito');

                  return (
                    <tr key={index} className="hover:bg-[#2a354a] transition border-b border-gray-700/20 last:border-0">
                      <td className="px-5 py-4 text-center font-bold text-gray-500">
                        {(index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="px-5 py-4 text-center text-[#ffc107] font-semibold">
                        {mostrarCredito}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 font-medium text-white">
                          <CreditCard size={15} className="text-gray-400" /> {cliente.documento_identidad}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs shrink-0">
                            <User size={14} fill="currentColor" />
                          </div>
                          <span className="font-semibold text-white">{cliente.nombre_completo}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400">
                        <div className="flex items-center gap-2">
                          <Map size={15} className="text-gray-400" /> {cliente.ciudad || 'Manizales'}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPin size={15} className="text-gray-400" /> {cliente.direccion}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} /> {cliente.telefono}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        {renderEstadoBadge(estadoMostrar, diasMoraMostrar)}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => setClienteSeleccionado(cliente)}
                          className="p-2 bg-gray-700/50 hover:bg-[#ffc107] text-gray-300 hover:text-[#111927] rounded-lg transition"
                          title="Ver Perfil"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE PERFIL DEL CLIENTE */}
      {clienteSeleccionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f1522] rounded-2xl w-full max-w-5xl relative shadow-2xl p-6 border border-gray-700/50">
            <button
              onClick={() => setClienteSeleccionado(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-full transition"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-[#ffc107]">
              Perfil del Cliente
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="flex flex-col shadow-lg rounded-xl overflow-hidden border border-gray-600/30">
                <div className="bg-gray-300 py-2.5 text-center">
                  <h3 className="text-[#111927] font-black text-[15px] uppercase tracking-widest">
                    Datos Personales
                  </h3>
                </div>
                <div className="bg-[#1a2235] p-6 text-[14px] space-y-4">
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Nombre Completo:</span>
                    <span className="text-white font-medium">{clienteSeleccionado.nombre_completo}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Cédula:</span>
                    <span className="text-white font-medium">{clienteSeleccionado.documento_identidad}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Fecha Vinculación:</span>
                    <span className="text-white font-medium">{formatearFecha(clienteSeleccionado.created_at)}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Dirección de Cobro:</span>
                    <span className="text-white font-medium uppercase">{clienteSeleccionado.direccion}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Contacto:</span>
                    <span className="text-white font-medium">{clienteSeleccionado.telefono}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Barrio:</span>
                    <span className="text-white font-medium">{clienteSeleccionado.barrio || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Número de Crédito:</span>
                    <span className="text-white font-medium">{clienteSeleccionado.numero_credito || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 font-semibold w-[132px]">Ruta:</span>
                      <span className="text-white font-medium">001</span>
                    </div>
                    <button onClick={() => navigate(`/clientes/${clienteSeleccionado.id}/creditos`, { state: { cliente: clienteSeleccionado } })}
                            className="bg-[#ffc107] text-[#111927] font-bold text-xs px-5 py-2 rounded-full shadow-lg uppercase hover:bg-yellow-400 transition">
                       Ver Créditos
                    </button>
                  </div>
                </div>
              </div>

              {/* TARJETA DATOS DE FIADOR */}
              <div className="flex flex-col shadow-lg rounded-xl overflow-hidden border border-gray-600/30">
                <div className="bg-gray-300 py-2.5 text-center">
                  <h3 className="text-[#111927] font-black text-[15px] uppercase tracking-widest">
                    Datos de Fiador
                  </h3>
                </div>
                <div className="bg-[#1a2235] p-6 text-[14px] space-y-4 h-full">
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Cédula:</span>
                    <span className="text-white font-medium">{clienteSeleccionado.fiador_cedula || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Nombre Completo:</span>
                    <span className="text-white font-medium uppercase">{clienteSeleccionado.fiador_nombre || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Dirección:</span>
                    <span className="text-white font-medium">{clienteSeleccionado.fiador_direccion || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Barrio:</span>
                    <span className="text-white font-medium">{clienteSeleccionado.fiador_barrio || 'N/A'}</span>
                  </div>
                  <div className="grid grid-cols-[140px_1fr] items-center border-b border-white/5 pb-2">
                    <span className="text-gray-300 font-semibold">Contacto:</span>
                    <span className="text-white font-medium">{clienteSeleccionado.fiador_contacto || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}