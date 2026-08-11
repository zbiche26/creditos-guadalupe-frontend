import { useState, useEffect } from 'react';
import { User, Plus, Search, MapPin, Phone, CreditCard } from 'lucide-react';
import api from '../services/api';

interface Cliente {
  id?: string;
  ruta_id: string;
  nombre_completo: string;
  documento_identidad: string;
  telefono: string;
  direccion: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    documento_identidad: '',
    nombre_completo: '',
    direccion: '',
    telefono: ''
  });


  const EMPRESA_ID_REAL = "6608657b-4a69-408c-a61f-99e1acbfa636";
  const RUTA_ID_REAL = "1548fd5c-997a-4a96-ade1-3ca4ae8e148b";


  const fetchClientes = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.get(`/rutas/${RUTA_ID_REAL}/clientes`);

      if (response.data.datos) {
        setClientes(response.data.datos);
      } else if (Array.isArray(response.data)) {
        setClientes(response.data);
      } else {
        setClientes([]);
      }
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setError("Error al conectar con la base de datos. Revisa la consola (F12).");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        empresa_id: EMPRESA_ID_REAL,
        ruta_id: RUTA_ID_REAL,
        nombre_completo: nuevoCliente.nombre_completo,
        documento_identidad: nuevoCliente.documento_identidad,
        telefono: nuevoCliente.telefono,
        direccion: nuevoCliente.direccion
      };

      await api.post('/clientes/', payload);

      setIsModalOpen(false);
      setNuevoCliente({
        documento_identidad: '',
        nombre_completo: '',
        direccion: '',
        telefono: ''
      });

      fetchClientes();
      alert("¡Cliente registrado con éxito en Supabase!");

    } catch (err: any) {
      console.error("Error al crear cliente:", err);
      alert("Error al guardar: " + (err.response?.data?.detail || "Revisa la consola"));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto font-sans">

      <div className="flex justify-between items-center mb-6 mt-2">
        <h2 className="text-[26px] font-bold text-white tracking-wide">Directorio de Clientes</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ffc107] text-[#111927] font-bold py-2.5 px-6 rounded-full hover:bg-yellow-400 transition shadow-lg flex items-center gap-2 text-sm"
        >
          <Plus size={18} strokeWidth={3} /> Crear Cliente
        </button>
      </div>

      <div className="bg-[#242e42] rounded-xl overflow-hidden shadow-md border border-gray-700/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1e2738]">
              <tr className="text-[13px] text-gray-400 border-b border-gray-700/30">
                <th className="px-6 py-4 font-semibold">CÉDULA</th>
                <th className="px-6 py-4 font-semibold">NOMBRE COMPLETO</th>
                <th className="px-6 py-4 font-semibold">DIRECCIÓN</th>
                <th className="px-6 py-4 font-semibold">CELULAR</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                    Cargando directorio...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-red-400 font-medium">
                    {error}
                  </td>
                </tr>
              ) : clientes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">
                    Aún no hay clientes registrados en esta ruta.
                  </td>
                </tr>
              ) : (
                clientes.map((cliente, index) => (
                  <tr key={index} className="hover:bg-[#2a354a] transition border-b border-gray-700/20 last:border-0">
                    {/* Celdas corregidas: el flex va adentro de un div */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium text-white">
                        <CreditCard size={15} className="text-gray-400" /> {cliente.documento_identidad}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gray-500 flex items-center justify-center text-white text-xs">
                          <User size={14} fill="currentColor" />
                        </div>
                        <span className="font-semibold text-white">{cliente.nombre_completo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-gray-400" /> {cliente.direccion}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Phone size={14} /> {cliente.telefono}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Crear Cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1e2638] rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-700/50">

            <div className="bg-[#151c2c] px-6 py-4 flex justify-between items-center border-b border-gray-700/40">
              <h3 className="text-lg font-bold text-white tracking-wide">Nuevo Cliente</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white font-bold text-lg transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCrearCliente} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5 uppercase">Cédula / Documento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 1053800222"
                  className="w-full bg-[#151c2c] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ffc107] border border-gray-700 placeholder-gray-500 text-sm"
                  value={nuevoCliente.documento_identidad}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, documento_identidad: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5 uppercase">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-[#151c2c] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ffc107] border border-gray-700 placeholder-gray-500 text-sm"
                  value={nuevoCliente.nombre_completo}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, nombre_completo: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5 uppercase">Dirección de Cobro</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Calle 20 # 10-12"
                  className="w-full bg-[#151c2c] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ffc107] border border-gray-700 placeholder-gray-500 text-sm"
                  value={nuevoCliente.direccion}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, direccion: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-gray-300 text-xs font-semibold mb-1.5 uppercase">Celular / Teléfono</label>
                <input
                  type="tel"
                  required
                  placeholder="Ej. 3104445566"
                  className="w-full bg-[#151c2c] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#ffc107] border border-gray-700 placeholder-gray-500 text-sm"
                  value={nuevoCliente.telefono}
                  onChange={(e) => setNuevoCliente({...nuevoCliente, telefono: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-gray-300 bg-[#151c2c] hover:bg-[#2c364c] rounded-xl font-semibold transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#ffc107] text-[#111927] hover:bg-yellow-400 rounded-xl font-bold shadow-lg transition text-sm"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}