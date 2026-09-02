import { useState, useEffect } from 'react';
import { User, Plus, MapPin, Phone, CreditCard, Eye, X, Map, Calendar, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import ModalRenovarCredito from '../components/ModalRenovarCredito';

interface CreditoHistorial {
  id: string;
  codigo_credito?: string;
  numero_credito?: string;
  monto_prestado: number;
  monto_total_pagar: number;
  saldo_restante: number;
  modalidad: string;
  estado: string;
  created_at: string;
}

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
  historial_creditos?: CreditoHistorial[];
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  
  // ESTADO PARA EL MODAL DE RENOVAR DESDE EL DIRECTORIO
  const [modalRenovarAbierto, setModalRenovarAbierto] = useState(false);

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

  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(monto || 0);
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
      case 'PRÓXIMO A PAGAR':
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

  // Buscamos si el cliente seleccionado tiene un crédito activo actualmente para poder renovarlo
  const creditoActivoDelCliente = clienteSeleccionado?.historial_creditos?.find(c => c.estado === 'ACTIVO');

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

                  const mostrarCredito = cliente.numero_credito && cliente.numero_credito !== 'N/A' && cliente.numero_credito !== '0' && cliente.numero_credito !== 'SIN CRÉDITO'
                    ? cliente.numero_credito
                    : 'Sin Crédito';

                  return (
                    <tr key={cliente.id || index} className="hover:bg-[#2a354a] transition border-b border-gray-700/20 last:border-0">
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
                          title="Ver Perfil e Historial"
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

      {/* MODAL DE PERFIL E HISTORIAL DE CRÉDITOS */}
      {clienteSeleccionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#0f1522] rounded-2xl w-full max-w-5xl relative shadow-2xl p-6 border border-gray-700/50 my-8">
            <button
              onClick={() => setClienteSeleccionado(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-full transition"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-[#ffc107]">
              Perfil del Cliente e Historial
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
              {/* Datos Personales */}
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

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 border-t border-white/5 gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300 font-semibold w-[132px]">Crédito Actual:</span>
                      <span className="text-[#ffc107] font-bold">{clienteSeleccionado.numero_credito || 'N/A'}</span>
                    </div>
                    
                    {/* BOTONES DE ACCIÓN: Renovar y Gestionar */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {creditoActivoDelCliente && (
                        <button
                          onClick={() => setModalRenovarAbierto(true)}
                          className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/40 px-3 py-2 rounded-full text-xs font-bold transition uppercase tracking-wider flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                        >
                          <RefreshCw size={14} /> Renovar
                        </button>
                      )}
                      
                      <button 
                        onClick={() => navigate(`/clientes/${clienteSeleccionado.id}/creditos`, { state: { cliente: clienteSeleccionado } })}
                        className="bg-[#ffc107] text-[#111927] font-bold text-xs px-5 py-2.5 rounded-full shadow-lg uppercase hover:bg-yellow-400 transition flex-1 sm:flex-none text-center"
                      >
                        Gestionar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Datos de Fiador */}
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

            {/* SECCIÓN DE HISTORIAL DE CRÉDITOS DENTRO DEL MODAL */}
            <div className="bg-[#1a2235] rounded-xl p-5 border border-gray-700/40">
              <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-[#ffc107]" /> Historial de Créditos Registrados
              </h3>

              {!clienteSeleccionado.historial_creditos || clienteSeleccionado.historial_creditos.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-4">No hay registros previos de créditos para este cliente.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {clienteSeleccionado.historial_creditos.map((credito, idx) => (
                    <div key={credito.id || idx} className="bg-[#151c2c] rounded-xl p-3.5 border border-gray-700/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {credito.codigo_credito || credito.numero_credito || `Crédito #${idx + 1}`}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase border ${
                            credito.estado === 'ACTIVO' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }`}>
                            {credito.estado}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={12} /> Modalidad: <span className="text-white font-medium">{credito.modalidad}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-right w-full sm:w-auto bg-[#1a2235] p-2.5 rounded-lg border border-gray-700/30 text-xs">
                        <div>
                          <p className="text-[9px] uppercase text-gray-400 font-bold">Prestado</p>
                          <p className="text-white font-semibold">{formatearDinero(credito.monto_prestado)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase text-gray-400 font-bold">Total a Pagar</p>
                          <p className="text-amber-400 font-semibold">{formatearDinero(credito.monto_total_pagar)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase text-gray-400 font-bold">Saldo Restante</p>
                          <p className="text-red-400 font-bold">{formatearDinero(credito.saldo_restante)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* RENDERIZAMOS EL MODAL DE RENOVAR */}
      {creditoActivoDelCliente && (
        <ModalRenovarCredito
          isOpen={modalRenovarAbierto}
          onClose={() => setModalRenovarAbierto(false)}
          creditoActivo={creditoActivoDelCliente}
          onRenovacionExitosa={() => {
            fetchClientes(); // Actualizamos la tabla
            setClienteSeleccionado(null); // Cerramos el perfil para forzar actualización visual limpia
            alert("¡Crédito renovado exitosamente!");
          }}
        />
      )}

    </div>
  );
}