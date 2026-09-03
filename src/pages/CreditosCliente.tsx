import { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, DollarSign, Calendar, CheckCircle2, RefreshCw, Clock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ModalRenovarCredito from '../components/ModalRenovarCredito';

interface AbonoItem {
  id: string;
  monto_pagado: number;
  created_at: string;
}

export default function CreditosCliente() {
  const navigate = useNavigate();
  const location = useLocation();
  const cliente = location.state?.cliente;

  const [saldoActual, setSaldoActual] = useState(0);
  const [prestamosActivos, setPrestamosActivos] = useState<any[]>([]);
  const [historialAbonos, setHistorialAbonos] = useState<AbonoItem[]>([]);
  const [vistaActiva, setVistaActiva] = useState<'PAGO' | 'NUEVO'>('NUEVO');

  // Input de abono con máscara (Texto en vez de número para que soporte puntos)
  const [abonoInput, setAbonoInput] = useState('');
  const [cuotaSugerida, setCuotaSugerida] = useState(0);

  const [prestamo, setPrestamo] = useState({
    montoInput: '',
    tasa_interes: '20',
    modalidad: 'DIARIO',
    numero_cuotas: '24',
  });

  const [modalRenovarAbierto, setModalRenovarAbierto] = useState(false);

  const cargarDatosCliente = async () => {
    try {
      // 1. Cargar el préstamo
      const response = await api.get(`/prestamos/cliente/${cliente.id}`);

      if (response.data.datos && response.data.datos.length > 0) {
        setPrestamosActivos(response.data.datos);
        const totalDeuda = response.data.datos.reduce((sum: number, p: any) => sum + p.saldo_restante, 0);
        setSaldoActual(totalDeuda);

        const cuotaReal = response.data.datos[0].valor_cuota;
        const cuotaRedondeada = Math.round(cuotaReal);
        setCuotaSugerida(cuotaRedondeada);
        setAbonoInput(new Intl.NumberFormat('es-CO').format(cuotaRedondeada));

        setVistaActiva('PAGO');
      } else {
        setSaldoActual(0);
        setPrestamosActivos([]);
        setVistaActiva('NUEVO');
      }

      // 2. Cargar historial de abonos
      const respAbonos = await api.get(`/abonos/cliente/${cliente.id}`);
      if (respAbonos.data && respAbonos.data.datos) {
        setHistorialAbonos(respAbonos.data.datos);
      }

    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    if (cliente) cargarDatosCliente();
  }, [cliente]);

  if (!cliente) {
    return (
      <div className="text-white p-8 text-center">
        <p>No se seleccionó ningún cliente.</p>
        <button onClick={() => navigate('/clientes')} className="text-[#ffc107] mt-4 font-bold hover:underline">
          Volver al Directorio
        </button>
      </div>
    );
  }

  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(monto || 0);
  };

  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return '';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // --- MÁSCARAS DE INPUTS (La magia de los puntos) ---
  const handleAbonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, '');
    if (!soloNumeros) {
      setAbonoInput('');
      return;
    }
    setAbonoInput(new Intl.NumberFormat('es-CO').format(parseInt(soloNumeros, 10)));
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, '');
    if (!soloNumeros) {
      setPrestamo({ ...prestamo, montoInput: '' });
      return;
    }
    setPrestamo({ ...prestamo, montoInput: new Intl.NumberFormat('es-CO').format(parseInt(soloNumeros, 10)) });
  };

  const handleCuotasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrestamo({ ...prestamo, numero_cuotas: e.target.value.replace(/\D/g, '') });
  };

  // Cálculos matemáticos en vivo quitando los puntos antes de operar
  const montoNum = parseInt(prestamo.montoInput.replace(/\./g, ''), 10) || 0;
  const interesNum = parseFloat(prestamo.tasa_interes) || 0;
  const cuotasNum = parseInt(prestamo.numero_cuotas, 10) || 0;

  const totalPagarCalculado = montoNum + (montoNum * (interesNum / 100));
  const valorCuotaCalculado = cuotasNum > 0 ? Math.round(totalPagarCalculado / cuotasNum) : 0;

  // --- REGISTRO DE PAGOS ---
  const handleAbono = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prestamosActivos.length) return;

    const empresaIdReal = localStorage.getItem('empresa_id');
    const cobradorIdReal = localStorage.getItem('usuario_id');
    
    // Le quitamos los puntos al valor final antes de enviar a Supabase
    const montoReal = parseInt(abonoInput.replace(/\./g, ''), 10) || 0;

    if (montoReal <= 0) {
      alert("El monto del abono debe ser mayor a cero.");
      return;
    }

    try {
      await api.post('/abonos/', {
        empresa_id: empresaIdReal || "00000000-0000-0000-0000-000000000000",
        prestamo_id: prestamosActivos[0].id,
        cobrador_id: cobradorIdReal || "00000000-0000-0000-0000-000000000000",
        monto_pagado: montoReal
      });
      alert("¡Pago registrado con éxito!");
      setAbonoInput(''); 
      cargarDatosCliente(); 
    } catch (err: any) {
      console.error("Error al procesar pago:", err);
      alert("Error: " + (err.response?.data?.detail || "Ocurrió un error al registrar el pago"));
    }
  };

  const handleSubmitCredito = async (e: React.FormEvent) => {
    e.preventDefault();
    const empresaIdReal = localStorage.getItem('empresa_id');

    if (montoNum <= 0) {
      alert("El monto prestado debe ser mayor a cero.");
      return;
    }

    try {
      await api.post('/prestamos/', {
        empresa_id: empresaIdReal || "00000000-0000-0000-0000-000000000000",
        cliente_id: cliente.id,
        ruta_id: "00000000-0000-0000-0000-000000000000",
        monto_prestado: montoNum,
        tasa_interes: interesNum,
        monto_total_pagar: totalPagarCalculado,
        modalidad: prestamo.modalidad,
        valor_cuota: valorCuotaCalculado
      });

      alert("¡Crédito adicional registrado con éxito!");
      setPrestamo({ montoInput: '', tasa_interes: '20', modalidad: 'DIARIO', numero_cuotas: '24' }); 
      cargarDatosCliente(); 
    } catch (err: any) {
      console.error("Error al registrar crédito:", err);
      alert("Error: " + (err.response?.data?.detail || "Ocurrió un error al registrar el crédito"));
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto pb-20 font-sans">
      <div className="flex items-center gap-4 mb-6 mt-2">
        <button onClick={() => navigate('/clientes')} className="text-gray-400 hover:text-white bg-[#1e2638] p-2 rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-xl font-bold text-white leading-tight">Créditos y Pagos</h2>
          <p className="text-[#ffc107] text-sm font-semibold">{cliente.nombre_completo}</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#1e2738] to-[#151c2c] rounded-2xl p-6 mb-6 shadow-lg border border-gray-700/30">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-1">Saldo Total</p>
            <h3 className="text-3xl font-black text-white">{formatearDinero(saldoActual)}</h3>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${saldoActual > 0 ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
            {saldoActual > 0 ? 'CON DEUDA' : 'A PAZ Y SALVO'}
          </div>
        </div>

        {saldoActual > 0 && prestamosActivos.length > 0 && (
          <div className="mt-5 pt-5 border-t border-gray-700/50 flex justify-end">
            <button onClick={() => setModalRenovarAbierto(true)} className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/40 px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition uppercase">
              <RefreshCw size={14} /> Renovar Crédito
            </button>
          </div>
        )}
      </div>

      {saldoActual > 0 && (
        <div className="flex gap-3 mb-6 bg-[#151c2c] p-1.5 rounded-xl border border-gray-700/50">
          <button onClick={() => setVistaActiva('PAGO')} className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-wider font-extrabold transition ${vistaActiva === 'PAGO' ? 'bg-green-500 text-[#111927] shadow-md' : 'text-gray-400 hover:text-white'}`}>Abonar Cuota</button>
          <button onClick={() => setVistaActiva('NUEVO')} className={`flex-1 py-2.5 rounded-lg text-xs uppercase tracking-wider font-extrabold transition ${vistaActiva === 'NUEVO' ? 'bg-[#ffc107] text-[#111927] shadow-md' : 'text-gray-400 hover:text-white'}`}>Crédito Extra</button>
        </div>
      )}

      {/* MÓDULO PAGO CON INPUT DE TEXTO */}
      {vistaActiva === 'PAGO' && saldoActual > 0 && (
        <form onSubmit={handleAbono} className="bg-[#242e42] rounded-2xl shadow-xl overflow-hidden border border-green-500/20 mb-8">
          <div className="bg-[#1e2738] px-6 py-4 border-b border-gray-700/50 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">Registrar Pago</h3>
          </div>
          <div className="p-6">
            <p className="text-center text-gray-400 text-sm mb-4">
              Valor sugerido de cuota: <strong className="text-white">{formatearDinero(cuotaSugerida)}</strong>
            </p>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <DollarSign size={24} className="text-green-500" />
              </div>
              <input
                type="text"
                required
                className="w-full bg-[#151c2c] text-green-400 text-3xl font-black pl-14 pr-4 py-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-700 text-center transition placeholder-gray-700"
                placeholder="0"
                value={abonoInput}
                onChange={handleAbonoChange}
              />
            </div>
            <button type="submit" className="w-full bg-green-500 text-[#111927] font-extrabold text-sm py-4 rounded-xl shadow-lg shadow-green-500/20 uppercase tracking-widest hover:bg-green-400 transition">
              Aplicar Abono
            </button>
          </div>
        </form>
      )}

      {/* MÓDULO NUEVO CRÉDITO */}
      {vistaActiva === 'NUEVO' && (
        <form onSubmit={handleSubmitCredito} className="bg-[#242e42] rounded-2xl shadow-xl overflow-hidden border border-gray-700/20 mb-8">
          <div className="bg-[#1e2738] px-6 py-4 border-b border-gray-700/50 flex items-center gap-2">
            <Calculator size={18} className="text-[#ffc107]" />
            <h3 className="text-lg font-bold text-white tracking-wide">Desembolso Adicional</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Monto a Prestar</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><DollarSign size={18} className="text-gray-500" /></div>
                <input
                  type="text"
                  required
                  className="w-full bg-[#151c2c] text-white text-lg font-semibold pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] border border-gray-700 placeholder-gray-600 transition"
                  placeholder="Ej. 1.000.000"
                  value={prestamo.montoInput}
                  onChange={handleMontoChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Interés (%)</label>
                <input type="text" required className="w-full bg-[#151c2c] text-white text-sm font-semibold px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] border border-gray-700" value={prestamo.tasa_interes} onChange={(e) => setPrestamo({...prestamo, tasa_interes: e.target.value.replace(/\D/g, '')})} />
              </div>
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Modalidad</label>
                <select className="w-full bg-[#151c2c] text-white text-sm font-semibold px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] border border-gray-700" value={prestamo.modalidad} onChange={(e) => setPrestamo({...prestamo, modalidad: e.target.value})}>
                  <option value="DIARIO">Diario</option>
                  <option value="SEMANAL">Semanal</option>
                  <option value="MENSUAL">Mensual</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Número de Cuotas</label>
              <input type="text" required className="w-full bg-[#151c2c] text-white text-sm font-semibold px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] border border-gray-700 placeholder-gray-600 transition" placeholder="Ej. 24" value={prestamo.numero_cuotas} onChange={handleCuotasChange} />
            </div>
            <div className="bg-[#151c2c] p-4 rounded-xl border border-[#ffc107]/25 mt-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-400 font-medium">Valor de cuota proyectada:</span>
                <span className="text-white font-bold">{valorCuotaCalculado > 0 ? formatearDinero(valorCuotaCalculado) : '$ 0'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                <span className="text-[#ffc107] font-bold">Total a Cobrar:</span>
                <span className="text-xl font-black text-white">{totalPagarCalculado > 0 ? formatearDinero(totalPagarCalculado) : '$ 0'}</span>
              </div>
            </div>
            <button type="submit" disabled={montoNum <= 0} className={`w-full mt-4 font-extrabold text-sm py-4 rounded-xl shadow-lg uppercase tracking-widest transition ${montoNum <= 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-[#ffc107] text-[#111927] hover:bg-yellow-400'}`}>
              Confirmar Desembolso
            </button>
          </div>
        </form>
      )}

      {/* HISTORIAL DE ABONOS */}
      <div className="bg-[#242e42] rounded-2xl shadow-xl overflow-hidden border border-gray-700/30">
        <div className="bg-[#1e2738] px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
          <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
            <Clock size={18} className="text-[#ffc107]" /> Historial de Abonos Realizados
          </h3>
          <span className="text-xs bg-[#ffc107]/10 text-[#ffc107] px-2.5 py-1 rounded-full font-bold">
            {historialAbonos.length} pagos
          </span>
        </div>
        <div className="divide-y divide-gray-700/30 max-h-80 overflow-y-auto">
          {historialAbonos.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Este cliente aún no registra abonos.</div>
          ) : (
            historialAbonos.map((abono) => (
              <div key={abono.id} className="p-4 flex justify-between items-center hover:bg-[#1e2738]/40 transition">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/10 p-2.5 rounded-xl border border-green-500/20 text-green-400"><DollarSign size={18} /></div>
                  <div>
                    <p className="text-white font-bold">{formatearDinero(abono.monto_pagado)}</p>
                    <p className="text-gray-400 text-xs">{formatearFecha(abono.created_at)}</p>
                  </div>
                </div>
                <span className="text-xs bg-green-500/20 text-green-400 font-bold px-2.5 py-1 rounded-full border border-green-500/30">Registrado</span>
              </div>
            ))
          )}
        </div>
      </div>

      {prestamosActivos.length > 0 && (
        <ModalRenovarCredito
          isOpen={modalRenovarAbierto}
          onClose={() => setModalRenovarAbierto(false)}
          creditoActivo={prestamosActivos[0]}
          onRenovacionExitosa={() => {
            cargarDatosCliente();
            alert("¡Crédito renovado exitosamente!");
          }}
        />
      )}
    </div>
  );
}