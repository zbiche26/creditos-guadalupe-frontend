import { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileText, User, DollarSign, Calendar, Layers, Percent } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Cliente {
  id: string;
  nombre_completo: string;
  documento_identidad: string;
}

export default function CrearVenta() {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(false);

    // Estado del formulario de préstamo adaptado a tu backend
  const [formData, setFormData] = useState({
    empresa_id: "6608657b-4a69-408c-a61f-99e1acbfa636", // Tu UUID de empresa existente
    cliente_id: '',
    ruta_id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', // O un UUID válido temporal para pruebas
    monto_prestado: '',
    tasa_interes: '20', 
    numero_cuotas: '',
    valor_cuota: '',
    modalidad: 'DIARIO',
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cliente_id) {
      alert("Por favor selecciona un cliente.");
      return;
    }

    setIsLoading(true);
    try {
      const monto = parseFloat(formData.monto_prestado);
      const cuotas = parseInt(formData.numero_cuotas);
      const vlrCuota = parseFloat(formData.valor_cuota);

      // Calculamos automáticamente el monto total a pagar (Cuotas * Valor de la cuota)
      const montoTotalPagar = cuotas * vlrCuota;

      await api.post('/prestamos/', {
        empresa_id: formData.empresa_id,
        cliente_id: formData.cliente_id,
        ruta_id: formData.ruta_id,
        monto_prestado: monto,
        tasa_interes: parseFloat(formData.tasa_interes),
        monto_total_pagar: montoTotalPagar,
        numero_cuotas: cuotas,
        valor_cuota: vlrCuota,
        modalidad: formData.modalidad
      });

      alert("¡Desembolso registrado con éxito!");
      navigate('/ventas');
    } catch (error: any) {
      console.error("Error al crear la venta:", error);
      const errorMsg = error.response?.data?.detail;
      if (Array.isArray(errorMsg)) {
        alert("Error de validación: " + errorMsg.map((e: any) => e.msg).join(', '));
      } else {
        alert(errorMsg || "Error al registrar el crédito.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto font-sans pb-10 mt-2">
      
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/ventas" className="text-gray-400 hover:text-[#ffc107] transition">
          <ArrowLeft size={28} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="text-[#ffc107]" size={32} /> Registrar Nueva Venta (Crédito)
          </h1>
          <p className="text-gray-400 mt-1">Asigna un nuevo préstamo a un cliente existente.</p>
        </div>
      </div>

      {/* Formulario Principal */}
      <div className="bg-[#242e42] rounded-2xl shadow-xl border border-gray-700/30 overflow-hidden p-8">
        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Selección de Cliente */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-gray-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                <User size={14} className="text-[#ffc107]" /> Seleccionar Cliente
              </label>
              <select
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleChange}
                required
                className="bg-[#151c2c] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ffc107] transition"
              >
                <option value="">-- Elige un cliente registrado --</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nombre_completo} (Cédula: {c.documento_identidad})
                  </option>
                ))}
              </select>
            </div>

            {/* Monto Prestado */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                <DollarSign size={14} className="text-[#ffc107]" /> Monto Prestado ($)
              </label>
              <input
                type="number"
                name="monto_prestado"
                value={formData.monto_prestado}
                onChange={handleChange}
                required
                placeholder="Ej. 500000"
                className="bg-[#151c2c] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ffc107] transition"
              />
            </div>

            {/* Tasa de Interés */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Percent size={14} className="text-[#ffc107]" /> Tasa de Interés (%)
              </label>
              <input
                type="number"
                name="tasa_interes"
                value={formData.tasa_interes}
                onChange={handleChange}
                required
                placeholder="Ej. 20"
                className="bg-[#151c2c] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ffc107] transition"
              />
            </div>

            {/* Número de Cuotas */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Calendar size={14} className="text-[#ffc107]" /> Número de Cuotas
              </label>
              <input
                type="number"
                name="numero_cuotas"
                value={formData.numero_cuotas}
                onChange={handleChange}
                required
                placeholder="Ej. 24"
                className="bg-[#151c2c] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ffc107] transition"
              />
            </div>

            {/* Valor de la Cuota Fija */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                <DollarSign size={14} className="text-[#ffc107]" /> Valor Cuota Fija ($)
              </label>
              <input
                type="number"
                name="valor_cuota"
                value={formData.valor_cuota}
                onChange={handleChange}
                required
                placeholder="Ej. 25000"
                className="bg-[#151c2c] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ffc107] transition"
              />
            </div>

            {/* Modalidad */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-gray-400 font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Layers size={14} className="text-[#ffc107]" /> Modalidad de Cobro
              </label>
              <select
                name="modalidad"
                value={formData.modalidad}
                onChange={handleChange}
                className="bg-[#151c2c] text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[#ffc107] transition"
              >
                <option value="DIARIO">Diario</option>
                <option value="SEMANAL">Semanal</option>
                <option value="MENSUAL">Mensual</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end pt-6 border-t border-gray-700/50">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#ffc107] hover:bg-[#e0a800] text-[#111927] font-extrabold px-8 py-3 rounded-xl transition shadow-lg flex justify-center items-center gap-2 disabled:opacity-50 uppercase tracking-widest text-sm"
            >
              {isLoading ? 'Registrando...' : <><Save size={18} /> Registrar Crédito</>}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}