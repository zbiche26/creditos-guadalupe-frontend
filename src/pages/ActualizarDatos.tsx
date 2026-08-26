import { useState, useEffect } from 'react';
import { Search, Save, User, MapPin, Phone, CheckCircle2, X } from 'lucide-react';
import api from '../services/api';

interface Cliente {
  id: string;
  nombre_completo: string;
  documento_identidad: string;
  telefono: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  referencia_personal: string;
  telefono_referencia: string;
}

export default function ActualizarDatos() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');

  // Cargar todos los clientes al iniciar
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        const respuesta = await api.get('/clientes/');
        setClientes(respuesta.data.datos || []);
      } catch (error) {
        console.error("Error al cargar clientes:", error);
      }
    };
    cargarClientes();
  }, []);

  // Filtrar clientes según el buscador
  const clientesFiltrados = clientes.filter(c => 
    c.nombre_completo.toLowerCase().includes(busqueda.toLowerCase()) || 
    c.documento_identidad.includes(busqueda)
  );

  const handleSeleccionarCliente = (cliente: Cliente) => {
    setClienteSeleccionado(cliente);
    setBusqueda(''); // Limpiamos el buscador para que no estorbe
    setMensajeExito('');
  };

  const handleGuardarCambios = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSeleccionado) return;

    setIsLoading(true);
    try {
      await api.put(`/clientes/${clienteSeleccionado.id}`, {
        nombre_completo: clienteSeleccionado.nombre_completo,
        documento_identidad: clienteSeleccionado.documento_identidad,
        telefono: clienteSeleccionado.telefono,
        direccion: clienteSeleccionado.direccion,
        barrio: clienteSeleccionado.barrio,
        ciudad: clienteSeleccionado.ciudad,
        referencia_personal: clienteSeleccionado.referencia_personal,
        telefono_referencia: clienteSeleccionado.telefono_referencia
      });

      // Actualizar la lista local para no recargar la página
      setClientes(clientes.map(c => c.id === clienteSeleccionado.id ? clienteSeleccionado : c));
      
      setMensajeExito('¡Los datos del cliente se actualizaron correctamente!');
      setTimeout(() => {
        setClienteSeleccionado(null);
        setMensajeExito('');
      }, 3000); // Volver al buscador después de 3 segundos
      
    } catch (error: any) {
      alert("Error al actualizar: " + (error.response?.data?.detail || "Intenta de nuevo"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[900px] mx-auto font-sans pb-12 mt-2">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-wide">Actualizar Datos</h2>
        <p className="text-gray-400 text-sm">Busca un cliente para modificar su información de contacto o residencia.</p>
      </div>

      {mensajeExito && (
        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 p-4 rounded-xl flex items-center gap-3 mb-6 shadow-sm">
          <CheckCircle2 size={20} /> {mensajeExito}
        </div>
      )}

      {/* Buscador de Clientes (Se oculta si hay un cliente seleccionado) */}
      {!clienteSeleccionado && (
        <div className="bg-[#242e42] rounded-2xl p-6 shadow-lg border border-gray-700/30">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-3.5 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar cliente por nombre o cédula..."
              className="w-full bg-[#151c2c] text-white px-12 py-3.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ffc107] transition"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {busqueda.length > 0 && (
            <div className="max-h-64 overflow-y-auto bg-[#1e2738] rounded-xl border border-gray-700/50 divide-y divide-gray-700/30">
              {clientesFiltrados.length > 0 ? (
                clientesFiltrados.map(cliente => (
                  <button
                    key={cliente.id}
                    onClick={() => handleSeleccionarCliente(cliente)}
                    className="w-full text-left px-5 py-3.5 hover:bg-[#ffc107]/10 hover:text-[#ffc107] transition flex justify-between items-center group text-white"
                  >
                    <div>
                      <p className="font-bold text-sm">{cliente.nombre_completo}</p>
                      <p className="text-xs text-gray-400 group-hover:text-[#ffc107]/70">CC: {cliente.documento_identidad} | {cliente.barrio}</p>
                    </div>
                  </button>
                ))
              ) : (
                <p className="p-4 text-center text-sm text-gray-400">No se encontraron clientes.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Formulario de Edición (Aparece al seleccionar un cliente) */}
      {clienteSeleccionado && (
        <div className="bg-[#242e42] rounded-2xl shadow-xl border border-gray-700/30 overflow-hidden relative">
          
          <div className="bg-[#1e2738] px-8 py-5 border-b border-gray-700/50 flex justify-between items-center">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <User size={18} className="text-[#ffc107]" /> Editando a {clienteSeleccionado.nombre_completo.split(' ')[0]}
            </h3>
            <button 
              onClick={() => setClienteSeleccionado(null)}
              className="text-gray-400 hover:text-red-400 transition bg-white/5 p-1.5 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleGuardarCambios} className="p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Nombre Completo</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#151c2c] text-white px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-[#ffc107] focus:outline-none"
                  value={clienteSeleccionado.nombre_completo}
                  onChange={(e) => setClienteSeleccionado({...clienteSeleccionado, nombre_completo: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Documento / Cédula</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#151c2c] text-white px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-[#ffc107] focus:outline-none"
                  value={clienteSeleccionado.documento_identidad}
                  onChange={(e) => setClienteSeleccionado({...clienteSeleccionado, documento_identidad: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Phone size={14}/> Teléfono</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#151c2c] text-white px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-[#ffc107] focus:outline-none"
                  value={clienteSeleccionado.telefono}
                  onChange={(e) => setClienteSeleccionado({...clienteSeleccionado, telefono: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><MapPin size={14}/> Dirección</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#151c2c] text-white px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-[#ffc107] focus:outline-none"
                  value={clienteSeleccionado.direccion}
                  onChange={(e) => setClienteSeleccionado({...clienteSeleccionado, direccion: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Barrio</label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#151c2c] text-white px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-[#ffc107] focus:outline-none"
                  value={clienteSeleccionado.barrio}
                  onChange={(e) => setClienteSeleccionado({...clienteSeleccionado, barrio: e.target.value})}
                />
              </div>
            </div>

            <div className="border-t border-gray-700/50 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Fiador / Ref. Personal</label>
                <input
                  type="text"
                  className="w-full bg-[#151c2c] text-white px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-[#ffc107] focus:outline-none"
                  value={clienteSeleccionado.referencia_personal}
                  onChange={(e) => setClienteSeleccionado({...clienteSeleccionado, referencia_personal: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"><Phone size={14}/> Teléfono Fiador</label>
                <input
                  type="text"
                  className="w-full bg-[#151c2c] text-white px-4 py-3 rounded-xl border border-gray-700 focus:ring-2 focus:ring-[#ffc107] focus:outline-none"
                  value={clienteSeleccionado.telefono_referencia}
                  onChange={(e) => setClienteSeleccionado({...clienteSeleccionado, telefono_referencia: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-[#ffc107] hover:bg-[#e0a800] text-[#111927] font-extrabold py-3.5 rounded-xl transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 uppercase tracking-widest"
            >
              {isLoading ? 'Guardando...' : <><Save size={20} /> Guardar Cambios</>}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}