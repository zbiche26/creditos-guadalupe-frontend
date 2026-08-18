import { useState } from 'react';
import { ArrowLeft, Calculator, DollarSign, Calendar } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function CreditosCliente() {
  const navigate = useNavigate();
  const location = useLocation();

  // Rescatamos al cliente que nos enviaron desde la pantalla anterior
  const cliente = location.state?.cliente;

  const [prestamo, setPrestamo] = useState({
    monto_prestado: '',
    tasa_interes: '20', // Por defecto 20%
    modalidad: 'DIARIO',
    valor_cuota: '',
  });

  // Si alguien entra aquí sin seleccionar un cliente, lo devolvemos
  if (!cliente) {
    return (
      <div className="text-white p-8 text-center">
        <p>No se seleccionó ningún cliente.</p>
        <button onClick={() => navigate('/clientes')} className="text-[#ffc107] mt-4">Volver al Directorio</button>
      </div>
    );
  }

  const calcularTotal = () => {
    const monto = parseFloat(prestamo.monto_prestado) || 0;
    const interes = parseFloat(prestamo.tasa_interes) || 0;
    return monto + (monto * (interes / 100));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert(`¡Próximamente conectaremos esto con FastAPI para desembolsar $${prestamo.monto_prestado}!`);
    // Aquí irá nuestra conexión con api.post('/prestamos/')
  };

  return (
    <div className="w-full max-w-lg mx-auto pb-20 font-sans">

      {/* HEADER MÓVIL */}
      <div className="flex items-center gap-4 mb-6 mt-2">
        <button onClick={() => navigate('/clientes')} className="text-gray-400 hover:text-white bg-[#1e2638] p-2 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white leading-tight">Créditos y Pagos</h2>
          <p className="text-[#ffc107] text-sm font-semibold">{cliente.nombre_completo}</p>
        </div>
      </div>

      {/* ESTADO ACTUAL (Tarjeta Resumen) */}
      <div className="bg-gradient-to-br from-[#1e2738] to-[#151c2c] rounded-2xl p-6 mb-6 shadow-lg border border-gray-700/30">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-1">Saldo Actual</p>
            <h3 className="text-3xl font-black text-white">$ 0<span className="text-lg text-gray-500 font-medium">.00</span></h3>
          </div>
          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
            A PAZ Y SALVO
          </div>
        </div>
      </div>

      {/* FORMULARIO DE NUEVO PRÉSTAMO */}
      <form onSubmit={handleSubmit} className="bg-[#242e42] rounded-2xl shadow-xl overflow-hidden border border-gray-700/20">
        <div className="bg-[#1e2738] px-6 py-4 border-b border-gray-700/50 flex items-center gap-2">
          <Calculator size={18} className="text-[#ffc107]" />
          <h3 className="text-lg font-bold text-white tracking-wide">Nuevo Desembolso</h3>
        </div>

        <div className="p-6 space-y-5">
          {/* Monto a Prestar */}
          <div>
            <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Monto a Prestar</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign size={18} className="text-gray-500" />
              </div>
              <input
                type="number"
                required
                className="w-full bg-[#151c2c] text-white text-lg font-semibold pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] border border-gray-700 placeholder-gray-600 transition"
                placeholder="Ej. 500000"
                value={prestamo.monto_prestado}
                onChange={(e) => setPrestamo({...prestamo, monto_prestado: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Modalidad */}
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Modalidad</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <select
                  className="w-full bg-[#151c2c] text-white text-sm font-semibold pl-9 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] border border-gray-700 appearance-none"
                  value={prestamo.modalidad}
                  onChange={(e) => setPrestamo({...prestamo, modalidad: e.target.value})}
                >
                  <option value="DIARIO">Diario</option>
                  <option value="SEMANAL">Semanal</option>
                  <option value="MENSUAL">Mensual</option>
                </select>
              </div>
            </div>

            {/* Valor Cuota */}
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Valor Cuota</label>
              <input
                type="number"
                required
                className="w-full bg-[#151c2c] text-white text-sm font-semibold px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] border border-gray-700 placeholder-gray-600 transition"
                placeholder="Ej. 10000"
                value={prestamo.valor_cuota}
                onChange={(e) => setPrestamo({...prestamo, valor_cuota: e.target.value})}
              />
            </div>
          </div>

          {/* Resumen Automático */}
          <div className="bg-[#151c2c] p-4 rounded-xl border border-[#ffc107]/20 mt-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium">Interés aplicado:</span>
              <span className="text-white font-bold">{prestamo.tasa_interes}%</span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700/50">
              <span className="text-[#ffc107] font-bold">Total a Cobrar:</span>
              <span className="text-xl font-black text-white">${calcularTotal().toLocaleString('es-CO')}</span>
            </div>
          </div>

          {/* Botón de Acción */}
          <button
            type="submit"
            className="w-full mt-4 bg-[#ffc107] text-[#111927] font-extrabold text-sm py-4 rounded-xl shadow-lg uppercase tracking-widest hover:bg-yellow-400 transition"
          >
            Registrar Desembolso
          </button>
        </div>
      </form>
    </div>
  );
}