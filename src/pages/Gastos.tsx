import { useState, useEffect } from 'react';
import { Plus, DollarSign, FileText, X } from 'lucide-react';
import api from '../services/api';

interface Gasto {
  id: string;
  cantidad: number;
  created_at: string;
  descripcion: string;
  valor_unitario: number;
  valor_total: number;
}

export default function Gastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [filtro, setFiltro] = useState<'dia' | 'semana' | 'mes' | 'todos'>('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Formulario de nuevo gasto (Manjeados como texto para las máscaras)
  const [cantidad, setCantidad] = useState('1');
  const [descripcion, setDescripcion] = useState('');
  const [valorInput, setValorInput] = useState('');

  const cargarGastos = async (tipoFiltro: string) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/gastos/?filtro=${tipoFiltro}`);
      if (response.data && response.data.datos) {
        setGastos(response.data.datos);
      } else {
        setGastos([]);
      }
    } catch (error) {
      console.error("Error al cargar gastos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarGastos(filtro);
  }, [filtro]);

  // Manejador para ponerle puntos de miles al valor
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, '');
    if (!soloNumeros) {
      setValorInput('');
      return;
    }
    setValorInput(new Intl.NumberFormat('es-CO').format(parseInt(soloNumeros, 10)));
  };

  // Manejador para la cantidad (evita letras y flechitas)
  const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCantidad(e.target.value.replace(/\D/g, ''));
  };

  const handleSubmitGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    const empresaId = localStorage.getItem('empresa_id');
    const usuarioId = localStorage.getItem('usuario_id');

    if (!empresaId || !usuarioId) {
      alert("Error de sesión. Vuelve a iniciar sesión.");
      return;
    }

    // Le quitamos los puntos para enviar el número real a la base de datos
    const valorReal = parseInt(valorInput.replace(/\./g, ''), 10) || 0;
    const cantidadReal = parseInt(cantidad, 10) || 1;

    if (valorReal <= 0) {
      alert("El valor del gasto debe ser mayor a cero.");
      return;
    }

    try {
      await api.post('/gastos/', {
        empresa_id: empresaId,
        usuario_id: usuarioId,
        cantidad: cantidadReal,
        descripcion: descripcion,
        valor_unitario: valorReal
      });

      alert("¡Gasto registrado con éxito!");
      setModalAbierto(false);
      setCantidad('1');
      setDescripcion('');
      setValorInput('');
      cargarGastos(filtro);
    } catch (error: any) {
      console.error("Error al registrar gasto:", error);
      alert("Error al guardar el gasto: " + (error.response?.data?.detail || "Revisa la consola"));
    }
  };

  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(monto);
  };

  const calcularSumaTotal = () => {
    return gastos.reduce((acc, item) => acc + item.valor_total, 0);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto font-sans pb-10">
      
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <div>
          <h2 className="text-[26px] font-bold text-white tracking-wide">Control de Gastos</h2>
          <p className="text-gray-400 text-sm mt-1">Registra y filtra las salidas de dinero del negocio.</p>
        </div>

        <button
          onClick={() => setModalAbierto(true)}
          className="bg-[#ffc107] hover:bg-yellow-400 text-[#111927] font-extrabold px-5 py-3 rounded-xl transition flex items-center gap-2 shadow-lg"
        >
          <Plus size={20} /> Registrar Gasto
        </button>
      </div>

      {/* Botones de Filtro (Día, Semana, Mes, Todos) */}
      <div className="flex gap-2 mb-6">
        {(['dia', 'semana', 'mes', 'todos'] as const).map((tipo) => (
          <button
            key={tipo}
            onClick={() => setFiltro(tipo)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
              filtro === tipo
                ? 'bg-[#ffc107] text-[#111927] shadow-md'
                : 'bg-[#242e42] text-gray-400 hover:text-white border border-gray-700/30'
            }`}
          >
            {tipo === 'dia' ? 'Hoy' : tipo === 'semana' ? 'Esta Semana' : tipo === 'mes' ? 'Este Mes' : 'Historial Total'}
          </button>
        ))}
      </div>

      {/* Tabla de Gastos */}
      <div className="bg-[#242e42] rounded-2xl shadow-xl border border-gray-700/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1e2738] text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-700/50">
                <th className="p-4 text-center">CANT</th>
                <th className="p-4">FECHA</th>
                <th className="p-4">DESCRIPCIÓN</th>
                <th className="p-4 text-right">VALOR UNITARIO</th>
                <th className="p-4 text-right">VALOR TOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30 text-sm text-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">Cargando gastos...</td>
                </tr>
              ) : gastos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">No hay gastos registrados en este periodo.</td>
                </tr>
              ) : (
                gastos.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-[#1e2738]/50 transition-colors">
                    <td className="p-4 text-center font-bold text-amber-400">{gasto.cantidad}</td>
                    <td className="p-4 text-gray-300 text-xs">{new Date(gasto.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-medium uppercase">{gasto.descripcion}</td>
                    <td className="p-4 text-right text-gray-300">{formatearDinero(gasto.valor_unitario)}</td>
                    <td className="p-4 text-right font-bold text-red-400">{formatearDinero(gasto.valor_total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Totalizador inferior */}
        <div className="bg-[#1e2738] p-4 flex justify-between items-center border-t border-gray-700/50">
          <span className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Gastos del Periodo:</span>
          <span className="text-xl font-black text-white">{formatearDinero(calcularSumaTotal())}</span>
        </div>
      </div>

      {/* MODAL REGISTRAR GASTO */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#242e42] rounded-2xl w-full max-w-md p-6 border border-gray-700/50 shadow-2xl relative animate-in fade-in zoom-in-95">
            
            <button 
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-[#1e2738] p-2 rounded-full transition"
            >
              <X size={18} />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Registrar Nuevo Gasto</h3>
            <p className="text-gray-400 text-sm mb-6">Ingresa los detalles de la salida de dinero.</p>

            <form onSubmit={handleSubmitGasto} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Descripción del Gasto</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#151c2c] text-white text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] border border-gray-700 placeholder-gray-600"
                    placeholder="Ej. Gasolina moto, Papelería..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Cantidad</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#151c2c] text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] border border-gray-700 text-center"
                    value={cantidad}
                    onChange={handleCantidadChange}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Valor Unitario</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign size={16} className="text-gray-500" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full bg-[#151c2c] text-white text-sm pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] border border-gray-700 placeholder-gray-600"
                      placeholder="Ej. 15.000"
                      value={valorInput}
                      onChange={handleValorChange}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!valorInput || !descripcion}
                  className={`w-full font-extrabold py-3.5 rounded-xl shadow-lg transition uppercase tracking-wider text-sm ${
                    !valorInput || !descripcion ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[#ffc107] hover:bg-yellow-400 text-[#111927]'
                  }`}
                >
                  Guardar Gasto
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}