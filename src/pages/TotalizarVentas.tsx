import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, FileText, History, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface LiquidacionItem {
  id: string;
  fecha: string;
  meta_recaudo: number;
  base_entregada: number;
  total_cobrado: number;
  total_gastos: number;
  valor_entregado_efectivo: number;
  valor_faltante: number;
  valor_sobrante: number;
}

export default function TotalizarVentas() {
  const navigate = useNavigate();
  const [vista, setVista] = useState<'liquidar' | 'historial'>('liquidar');
  const [isLoading, setIsLoading] = useState(true);

  // Estados del formulario
  const [fecha] = useState(new Date().toISOString().split('T')[0]);
  const [metaRecaudo, setMetaRecaudo] = useState(500000);
  const [totalCobrado, setTotalCobrado] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  const [creditosNuevos, setCreditosNuevos] = useState(0);

  // Campos tipeados por el usuario
  const [baseInput, setBaseInput] = useState('');
  const [efectivoInput, setEfectivoInput] = useState('');

  const [faltante, setFaltante] = useState(0);
  const [sobrante, setSobrante] = useState(0);

  const [historial, setHistorial] = useState<LiquidacionItem[]>([]);
  const [filtroHistorial, setFiltroHistorial] = useState<'dia' | 'semana' | 'mes' | 'todos'>('todos');
  const [isLoadingHistorial, setIsLoadingHistorial] = useState(false);

  // Cargar datos diarios
  useEffect(() => {
    const cargarDatosDiarios = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/liquidacion/diaria');
        const data = response.data;
        
        setMetaRecaudo(data.meta_recaudo || 0);
        setTotalCobrado(data.total_cobrado || 0);
        setTotalGastos(data.total_gastos || 0);
        setCreditosNuevos(data.creditos_nuevos || 0);

        // FÓRMULA MÁGICA: Cobrado - Gastos - Créditos Nuevos
        const efectivoSugerido = Math.max(0, (data.total_cobrado || 0) - (data.total_gastos || 0) - (data.creditos_nuevos || 0));
        setEfectivoInput(efectivoSugerido > 0 ? new Intl.NumberFormat('es-CO').format(efectivoSugerido) : '');

      } catch (error) {
        console.error("Error al cargar datos de liquidación:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (vista === 'liquidar') {
      cargarDatosDiarios();
    }
  }, [vista]);

  // Recálculo dinámico matemático
  useEffect(() => {
    const baseCajaNum = parseInt(baseInput.replace(/\D/g, ''), 10) || 0;
    const efectivoNum = parseInt(efectivoInput.replace(/\D/g, ''), 10) || 0;

    // FÓRMULA MATEMÁTICA CORREGIDA EN REACT
    const esperado = baseCajaNum + totalCobrado - totalGastos - creditosNuevos;
    const diferencia = efectivoNum - esperado;

    if (diferencia < 0) {
      setFaltante(Math.abs(diferencia));
      setSobrante(0);
    } else {
      setSobrante(diferencia);
      setFaltante(0);
    }
  }, [baseInput, efectivoInput, totalCobrado, totalGastos, creditosNuevos]);

  // Manejador de la Base de Caja
  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, '');
    if (!soloNumeros) {
      setBaseInput('');
      setEfectivoInput(new Intl.NumberFormat('es-CO').format(Math.max(0, totalCobrado - totalGastos - creditosNuevos)));
      return;
    }
    
    const baseCajaNum = parseInt(soloNumeros, 10);
    setBaseInput(new Intl.NumberFormat('es-CO').format(baseCajaNum));
    
    const nuevoEsperado = Math.max(0, baseCajaNum + totalCobrado - totalGastos - creditosNuevos);
    setEfectivoInput(new Intl.NumberFormat('es-CO').format(nuevoEsperado));
  };

  // Manejador del Efectivo Físico
  const handleEfectivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, '');
    if (!soloNumeros) {
      setEfectivoInput('');
      return;
    }
    setEfectivoInput(new Intl.NumberFormat('es-CO').format(parseInt(soloNumeros, 10)));
  };

  const cargarHistorial = async (tipoFiltro: string) => {
    setIsLoadingHistorial(true);
    try {
      const response = await api.get(`/liquidaciones/?filtro=${tipoFiltro}`);
      if (response.data && response.data.datos) {
        setHistorial(response.data.datos);
      } else {
        setHistorial([]);
      }
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setIsLoadingHistorial(false);
    }
  };

  useEffect(() => {
    if (vista === 'historial') {
      cargarHistorial(filtroHistorial);
    }
  }, [vista, filtroHistorial]);

  const handleLiquidar = async () => {
    const empresaId = localStorage.getItem('empresa_id');
    const cobradorId = localStorage.getItem('usuario_id');
    
    const baseCajaNum = parseInt(baseInput.replace(/\D/g, ''), 10) || 0;
    const efectivoNum = parseInt(efectivoInput.replace(/\D/g, ''), 10) || 0;

    try {
      await api.post('/liquidaciones/', {
        empresa_id: empresaId || "00000000-0000-0000-0000-000000000000",
        cobrador_id: cobradorId || "00000000-0000-0000-0000-000000000000",
        ruta_id: "00000000-0000-0000-0000-000000000000",
        fecha: fecha,
        meta_recaudo: metaRecaudo,
        base_entregada: baseCajaNum,
        total_cobrado: totalCobrado,
        total_gastos: totalGastos,
        valor_entregado_efectivo: efectivoNum,
        valor_faltante: faltante,
        valor_sobrante: sobrante
      });

      alert("¡Liquidación de cobro realizada con éxito!");
      setVista('historial');
    } catch (error: any) {
      console.error("Error al liquidar:", error);
      alert("Error al procesar la liquidación: " + (error.response?.data?.detail || "Revisa la consola"));
    }
  };

  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(monto || 0);
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto font-sans pb-12 mt-2">
      
      {/* Header y Selector de Vistas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="text-gray-400 hover:text-white bg-[#1e2738] p-2.5 rounded-full transition shadow-md"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Liquidación y Cierre de Caja</h2>
            <p className="text-gray-400 text-sm">Gestiona el cierre diario y consulta el historial de la ruta.</p>
          </div>
        </div>

        <div className="flex gap-2 bg-[#1e2738] p-1.5 rounded-xl border border-gray-700/50">
          <button
            onClick={() => setVista('liquidar')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 ${
              vista === 'liquidar' ? 'bg-[#ffc107] text-[#111927] shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calculator size={16} /> Realizar Cierre
          </button>
          <button
            onClick={() => setVista('historial')}
            className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 ${
              vista === 'historial' ? 'bg-[#ffc107] text-[#111927] shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            <History size={16} /> Historial
          </button>
        </div>
      </div>

      {/* VISTA 1: REALIZAR LIQUIDACIÓN */}
      {vista === 'liquidar' && (
        <div className="bg-[#242e42] rounded-3xl shadow-2xl border border-gray-700/40 overflow-hidden">
          <div className="bg-[#1e2738] px-8 py-5 border-b border-gray-700/50 flex justify-between items-center">
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
              LIQUIDACIÓN DE COBRO - RUTA 002
            </h3>
            <span className="text-xs bg-amber-500/10 text-[#ffc107] border border-amber-500/20 px-3 py-1 rounded-full font-bold">
              {fecha}
            </span>
          </div>

          {isLoading ? (
            <div className="p-20 text-center text-gray-400">Calculando valores reales del día...</div>
          ) : (
            <div className="p-8 space-y-4 text-sm">
              <div className="flex justify-between items-center py-2.5 border-b border-gray-700/30">
                <span className="text-gray-400 font-medium">Fecha de Liquidación:</span>
                <span className="text-white font-bold">{fecha}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-gray-700/30">
                <span className="text-gray-400 font-medium">Meta de Recaudo hoy:</span>
                <span className="text-white font-bold">{formatearDinero(metaRecaudo)}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-gray-700/30">
                <span className="text-gray-300 font-bold">Saldo Actual de Caja de Inicio (Base):</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    type="text"
                    className="bg-[#151c2c] text-[#ffc107] font-bold text-right pl-8 pr-4 py-2 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ffc107] w-48 transition placeholder-gray-600"
                    placeholder="0"
                    value={baseInput}
                    onChange={handleBaseChange}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-gray-700/30">
                <span className="text-gray-400 font-medium">Valor Total Cobrado (Abonos de hoy):</span>
                <span className="text-green-400 font-bold">{formatearDinero(totalCobrado)}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-gray-700/30">
                <span className="text-gray-400 font-medium">Valor Total Gastos de hoy:</span>
                <div className="flex items-center gap-3">
                  <span className="text-red-400 font-bold">{formatearDinero(totalGastos)}</span>
                  <button 
                    onClick={() => navigate('/gastos')}
                    className="text-xs bg-[#1e2738] hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-600 transition flex items-center gap-1.5"
                  >
                    <FileText size={14} /> Ver Gastos
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-gray-700/30">
                <span className="text-gray-400 font-medium">Valor Créditos Nuevos:</span>
                <span className="text-amber-400 font-bold">{formatearDinero(creditosNuevos)}</span>
              </div>

              <div className="flex justify-between items-center py-3.5 px-4 bg-[#1e2738] rounded-xl border border-gray-700/50 mt-2">
                <span className="text-gray-200 font-extrabold uppercase tracking-wide">VALOR ESPERADO EN CAJA:</span>
                <span className="text-xl font-black text-white">
                  {formatearDinero((parseInt(baseInput.replace(/\D/g, ''), 10) || 0) + totalCobrado - totalGastos - creditosNuevos)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-gray-700/30">
                <span className="text-gray-400 font-medium">Valor Faltante:</span>
                <span className="text-red-400 font-bold">{formatearDinero(faltante)}</span>
              </div>

              <div className="flex justify-between items-center py-2.5 border-b border-gray-700/30">
                <span className="text-gray-400 font-medium">Valor Sobrante:</span>
                <span className="text-green-400 font-bold">{formatearDinero(sobrante)}</span>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-gray-300 font-bold">Valor Entregado en Efectivo:</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                  <input
                    type="text"
                    className="bg-[#151c2c] text-white font-bold text-right pl-8 pr-4 py-2.5 rounded-xl border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ffc107] w-48 transition placeholder-gray-600"
                    placeholder="0"
                    value={efectivoInput}
                    onChange={handleEfectivoChange}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="p-6 bg-[#1e2738] border-t border-gray-700/50 text-center">
            <button
              onClick={handleLiquidar}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-emerald-600/20 uppercase tracking-widest transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={20} /> Liquidar Cobro
            </button>
          </div>
        </div>
      )}

      {/* VISTA 2: HISTORIAL */}
      {vista === 'historial' && (
        <div className="space-y-6">
          <div className="flex gap-2">
            {(['dia', 'semana', 'mes', 'todos'] as const).map((tipo) => (
              <button
                key={tipo}
                onClick={() => setFiltroHistorial(tipo)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  filtroHistorial === tipo
                    ? 'bg-[#ffc107] text-[#111927] shadow-md'
                    : 'bg-[#242e42] text-gray-400 hover:text-white border border-gray-700/30'
                }`}
              >
                {tipo === 'dia' ? 'Hoy' : tipo === 'semana' ? 'Esta Semana' : tipo === 'mes' ? 'Este Mes' : 'Historial Total'}
              </button>
            ))}
          </div>

          <div className="bg-[#242e42] rounded-2xl shadow-xl border border-gray-700/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1e2738] text-gray-400 text-xs font-bold uppercase tracking-wider border-b border-gray-700/50">
                    <th className="p-4">FECHA</th>
                    <th className="p-4 text-right">RECAUDADO</th>
                    <th className="p-4 text-right">GASTOS</th>
                    <th className="p-4 text-right">ENTREGADO</th>
                    <th className="p-4 text-center">ESTADO / DIFERENCIA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30 text-sm text-white">
                  {isLoadingHistorial ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400">Cargando historial...</td>
                    </tr>
                  ) : historial.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400">No hay liquidaciones registradas en este periodo.</td>
                    </tr>
                  ) : (
                    historial.map((item) => {
                      const tieneFaltante = item.valor_faltante > 0;
                      const tieneSobrante = item.valor_sobrante > 0;

                      return (
                        <tr key={item.id} className="hover:bg-[#1e2738]/50 transition-colors">
                          <td className="p-4 text-gray-300 font-medium">{item.fecha}</td>
                          <td className="p-4 text-right text-green-400 font-bold">{formatearDinero(item.total_cobrado)}</td>
                          <td className="p-4 text-right text-red-400">{formatearDinero(item.total_gastos)}</td>
                          <td className="p-4 text-right text-white font-bold">{formatearDinero(item.valor_entregado_efectivo)}</td>
                          <td className="p-4 text-center">
                            {tieneFaltante ? (
                              <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold">
                                Faltante: {formatearDinero(item.valor_faltante)}
                              </span>
                            ) : tieneSobrante ? (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold">
                                Sobrante: {formatearDinero(item.valor_sobrante)}
                              </span>
                            ) : (
                              <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-xs font-bold">
                                ¡A Paz y Salvo!
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}