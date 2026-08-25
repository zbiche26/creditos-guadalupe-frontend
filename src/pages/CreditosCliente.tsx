import { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreditosCliente() {
  const navigate = useNavigate();
  const location = useLocation();
  const cliente = location.state?.cliente;

  // --- ESTADOS ---
  const [saldoActual, setSaldoActual] = useState(0);
  const [prestamosActivos, setPrestamosActivos] = useState<any[]>([]);

  // Pestañas: PAGO o NUEVO
  const [vistaActiva, setVistaActiva] = useState<'PAGO' | 'NUEVO'>('NUEVO');

  // Estado para el formulario de PAGO
  const [montoAbono, setMontoAbono] = useState('');
  const [cuotaSugerida, setCuotaSugerida] = useState(0);

  // Estado para el formulario de NUEVO PRÉSTAMO
  const [prestamo, setPrestamo] = useState({
    monto_prestado: '',
    tasa_interes: '20',
    modalidad: 'DIARIO',
    valor_cuota: '',
  });

  // --- CARGA DE DATOS ---
  const cargarSaldo = async () => {
    try {
      const response = await api.get(`/prestamos/cliente/${cliente.id}`);

      if (response.data.datos && response.data.datos.length > 0) {
        setPrestamosActivos(response.data.datos);

        // Sumamos los saldos si tiene más de un crédito activo
        const totalDeuda = response.data.datos.reduce((sum: number, p: any) => sum + p.saldo_restante, 0);
        setSaldoActual(totalDeuda);

        // Sugerimos el valor de la cuota del crédito más antiguo
        setCuotaSugerida(response.data.datos[0].valor_cuota);
        setMontoAbono(response.data.datos[0].valor_cuota.toString());

        setVistaActiva('PAGO'); // Lo pasamos directo a la vista de cobro
      } else {
        setSaldoActual(0);
        setPrestamosActivos([]);
        setVistaActiva('NUEVO');
      }
    } catch (error) {
      console.error("Error al cargar préstamos:", error);
    }
  };

  useEffect(() => {
    if (cliente) cargarSaldo();
  }, [cliente]);

  if (!cliente) {
    return (
      <div className="text-white p-8 text-center">
        <p>No se seleccionó ningún cliente.</p>
        <button onClick={() => navigate('/clientes')} className="text-[#ffc107] mt-4">Volver al Directorio</button>
      </div>
    );
  }

  // --- FUNCIÓN PARA REGISTRAR PAGO ---
  const handleAbono = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prestamosActivos.length) return;

    // 1. Obtenemos los IDs reales del Login
    const empresaIdReal = localStorage.getItem('empresa_id');
    const cobradorIdReal = localStorage.getItem('usuario_id');

    // Validación de seguridad
    if (!empresaIdReal || !cobradorIdReal) {
      alert("Error: No se encontró la sesión activa. Por favor cierra sesión y vuelve a entrar.");
      return;
    }

    try {
      const payloadAbono = {
        empresa_id: empresaIdReal,
        prestamo_id: prestamosActivos[0].id,
        cobrador_id: cobradorIdReal,
        monto_pagado: parseFloat(montoAbono)
      };

      await api.post('/abonos/', payloadAbono);

      alert("¡Pago registrado con éxito!");
      setMontoAbono(''); 
      cargarSaldo(); 

    } catch (err: any) {
      console.error("Error al procesar pago:", err);
      alert("Error: " + (err.response?.data?.detail || "Revisa la consola"));
    }
  };

  // --- FUNCIÓN PARA REGISTRAR NUEVO CRÉDITO ---
  const calcularTotal = () => {
    const monto = parseFloat(prestamo.monto_prestado) || 0;
    const interes = parseFloat(prestamo.tasa_interes) || 0;
    return monto + (monto * (interes / 100));
  };

  const handleSubmitCredito = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Obtenemos el ID real de la empresa desde el Login
    const empresaIdReal = localStorage.getItem('empresa_id');

    if (!empresaIdReal) {
      alert("Error: No se encontró la sesión activa. Por favor cierra sesión y vuelve a entrar.");
      return;
    }

    try {
      const payloadPrestamo = {
        empresa_id: empresaIdReal,
        cliente_id: cliente.id,
        ruta_id: "00000000-0000-0000-0000-000000000000", // Ruta por defecto temporal
        monto_prestado: parseFloat(prestamo.monto_prestado),
        tasa_interes: parseFloat(prestamo.tasa_interes),
        monto_total_pagar: calcularTotal(),
        modalidad: prestamo.modalidad,
        valor_cuota: parseFloat(prestamo.valor_cuota)
      };

      await api.post('/prestamos/', payloadPrestamo);

      alert("¡Crédito adicional registrado con éxito!");
      setPrestamo({ ...prestamo, monto_prestado: '', valor_cuota: '' }); 
      cargarSaldo(); 

    } catch (err: any) {
      console.error("Error al registrar crédito:", err);
      alert("Error: " + (err.response?.data?.detail || "Revisa la consola"));
    }
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
            <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-1">Saldo Total</p>
            <h3 className="text-3xl font-black text-white">
              $ {saldoActual.toLocaleString('es-CO')}
            </h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${saldoActual > 0 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
            {saldoActual > 0 ? 'CON DEUDA' : 'A PAZ Y SALVO'}
          </div>
        </div>
      </div>

      {/* SISTEMA DE PESTAÑAS (Solo visible si hay deuda) */}
      {saldoActual > 0 && (
        <div className="flex gap-3 mb-6 bg-[#151c2c] p-1.5 rounded-xl border border-gray-700/50">
          <button
            onClick={() => setVistaActiva('PAGO')}
            className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-wider font-extrabold transition ${vistaActiva === 'PAGO' ? 'bg-green-500 text-[#111927] shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Abonar Cuota
          </button>
          <button
            onClick={() => setVistaActiva('NUEVO')}
            className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-wider font-extrabold transition ${vistaActiva === 'NUEVO' ? 'bg-[#ffc107] text-[#111927] shadow-md' : 'text-gray-400 hover:text-white'}`}
          >
            Crédito Extra
          </button>
        </div>
      )}

      {/* MÓDULO DE RECAUDO (PAGO) */}
      {vistaActiva === 'PAGO' && saldoActual > 0 && (
        <form onSubmit={handleAbono} className="bg-[#242e42] rounded-2xl shadow-xl overflow-hidden border border-green-500/20">
          <div className="bg-[#1e2738] px-6 py-4 border-b border-gray-700/50 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">Registrar Pago</h3>
          </div>

          <div className="p-6">
            <p className="text-center text-gray-400 text-sm mb-4">
              Valor de la cuota: <strong className="text-white">${cuotaSugerida.toLocaleString('es-CO')}</strong>
            </p>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <DollarSign size={24} className="text-green-500" />
              </div>
              <input
                type="number"
                required
                className="w-full bg-[#151c2c] text-green-400 text-3xl font-black pl-14 pr-4 py-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700 text-center transition placeholder-gray-700"
                placeholder="0"
                value={montoAbono}
                onChange={(e) => setMontoAbono(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-[#111927] font-extrabold text-sm py-4 rounded-xl shadow-lg shadow-green-500/20 uppercase tracking-widest hover:bg-green-400 transition"
            >
              Aplicar Abono
            </button>
          </div>
        </form>
      )}

      {/* MÓDULO DE NUEVO CRÉDITO */}
      {vistaActiva === 'NUEVO' && (
        <form onSubmit={handleSubmitCredito} className="bg-[#242e42] rounded-2xl shadow-xl overflow-hidden border border-gray-700/20">
          <div className="bg-[#1e2738] px-6 py-4 border-b border-gray-700/50 flex items-center gap-2">
            <Calculator size={18} className="text-[#ffc107]" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              {saldoActual > 0 ? 'Desembolso Adicional' : 'Nuevo Desembolso'}
            </h3>
          </div>

          <div className="p-6 space-y-5">
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

            <button
              type="submit"
              className="w-full mt-4 bg-[#ffc107] text-[#111927] font-extrabold text-sm py-4 rounded-xl shadow-lg uppercase tracking-widest hover:bg-yellow-400 transition"
            >
              Confirmar Desembolso
            </button>
          </div>
        </form>
      )}

    </div>
  );
}