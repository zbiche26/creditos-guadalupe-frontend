import { useState, useEffect } from 'react';
import { Search, CreditCard, DollarSign, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

// IMPORTAMOS LOS MODALES
import ModalRenovarCredito from '../components/ModalRenovarCredito';
import ModalRefinanciarCredito from '../components/ModalRefinanciarCredito';

interface CreditoActivo {
  id: string;
  codigo_credito?: string;
  monto_prestado: number;
  monto_total_pagar: number;
  saldo_restante: number;
  modalidad: string;
  estado: string;
  created_at: string;
  valor_cuota?: number; 
  cliente_id: string;
  cliente_nombre: string;
  cliente_documento: string;
  estado_credito: string;
  dias_mora: number;
}

export default function CreditosActivos() {
  const [creditos, setCreditos] = useState<CreditoActivo[]>([]);
  const [filtrados, setFiltrados] = useState<CreditoActivo[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [cargandoPagoId, setCargandoPagoId] = useState<string | null>(null);

  // Estados para inputs y para rastrear lo que se ha pagado en esta sesión
  const [abonosInput, setAbonosInput] = useState<{ [key: string]: string }>({});

  // ESTADOS PARA LOS MODALES DE RENOVAR Y REFINANCIAR
  const [creditoAccion, setCreditoAccion] = useState<CreditoActivo | null>(null);
  const [modalRenovarAbierto, setModalRenovarAbierto] = useState(false);
  const [modalRefinanciarAbierto, setModalRefinanciarAbierto] = useState(false);

  // --- VERIFICAR ROL (A PRUEBA DE BALAS PARA VERCEL) ---
  const usuarioRol = (localStorage.getItem('usuario_rol') || '').toUpperCase();
  const usuarioEmail = (localStorage.getItem('usuario_email') || '').toLowerCase();
  
  // Validamos si tiene rol explícito de ADMIN, si el correo dice admin, o si tiene comillas extra
  const isAdmin = usuarioRol.includes('ADMIN') || usuarioEmail.includes('admin') || usuarioRol === '"ADMIN"';

  // --- LÓGICA DE MEMORIA HASTA LA MEDIANOCHE ---
  const obtenerFechaHoy = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [pagosCompletados, setPagosCompletados] = useState<{ [key: string]: number }>(() => {
    const guardado = localStorage.getItem('abonos_aplicados_hoy');
    if (guardado) {
      try {
        const data = JSON.parse(guardado);
        if (data.fecha === obtenerFechaHoy()) {
          return data.pagos || {};
        }
      } catch (error) {
        console.error("Error leyendo abonos:", error);
      }
    }
    return {}; 
  });

  const obtenerConfigPais = () => {
    const pais = localStorage.getItem('pais_sistema') || 'CO';
    if (pais === 'MX') return { locale: 'es-MX', currency: 'MXN' };
    if (pais === 'US') return { locale: 'en-US', currency: 'USD' };
    if (pais === 'PE') return { locale: 'es-PE', currency: 'PEN' };
    if (pais === 'AR') return { locale: 'es-AR', currency: 'ARS' };
    if (pais === 'BR') return { locale: 'pt-BR', currency: 'BRL' }; 
    return { locale: 'es-CO', currency: 'COP' };
  };

  const formatearDinero = (monto: number) => {
    const { locale, currency } = obtenerConfigPais();
    return new Intl.NumberFormat(locale, { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(monto || 0);
  };

  const fetchCreditosActivos = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/clientes/');
      const clientesData = response.data.datos || response.data || [];
      
      let listaActivos: CreditoActivo[] = [];

      clientesData.forEach((cliente: any) => {
        if (cliente.historial_creditos && cliente.historial_creditos.length > 0) {
          const creditosActivosCliente = cliente.historial_creditos.filter((c: any) => c.estado === 'ACTIVO');
          
          creditosActivosCliente.forEach((credito: any) => {
            listaActivos.push({
              ...credito,
              cliente_id: cliente.id,
              cliente_nombre: cliente.nombre_completo,
              cliente_documento: cliente.documento_identidad,
              estado_credito: cliente.estado_credito || 'AL_DIA',
              dias_mora: cliente.dias_mora || 0
            });
          });
        }
      });

      listaActivos.sort((a, b) => {
        if (a.estado_credito === 'MORA' && b.estado_credito !== 'MORA') return -1;
        if (a.estado_credito !== 'MORA' && b.estado_credito === 'MORA') return 1;
        return 0;
      });

      setCreditos(listaActivos);
      setFiltrados(listaActivos);
      
      setAbonosInput(prev => {
        const nuevos = { ...prev };
        const { locale } = obtenerConfigPais();
        listaActivos.forEach(c => {
          if (nuevos[c.id] === undefined && c.valor_cuota) {
            nuevos[c.id] = new Intl.NumberFormat(locale).format(Math.round(c.valor_cuota));
          }
        });
        return nuevos;
      });

    } catch (err) {
      console.error("Error al cargar los créditos activos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditosActivos();
  }, []);

  useEffect(() => {
    if (!busqueda.trim()) {
      setFiltrados(creditos);
    } else {
      const termino = busqueda.toLowerCase();
      const resultado = creditos.filter(c => 
        c.cliente_nombre.toLowerCase().includes(termino) || 
        c.cliente_documento.includes(termino)
      );
      setFiltrados(resultado);
    }
  }, [busqueda, creditos]);

  const handleAbonoChange = (creditoId: string, value: string) => {
    const soloNumeros = value.replace(/\D/g, '');
    if (!soloNumeros) {
      setAbonosInput(prev => ({ ...prev, [creditoId]: '' }));
      return;
    }
    const { locale } = obtenerConfigPais();
    setAbonosInput(prev => ({ 
      ...prev, 
      [creditoId]: new Intl.NumberFormat(locale).format(parseInt(soloNumeros, 10)) 
    }));
  };

  const registrarAbonoDirecto = async (credito: CreditoActivo) => {
    const inputVal = abonosInput[credito.id];
    if (!inputVal) return;
    
    const montoReal = parseInt(inputVal.replace(/\D/g, ''), 10);
    if (montoReal <= 0) {
      alert("El monto debe ser mayor a cero.");
      return;
    }

    setCargandoPagoId(credito.id);
    const empresaIdReal = localStorage.getItem('empresa_id') || "00000000-0000-0000-0000-000000000000";
    const cobradorIdReal = localStorage.getItem('usuario_id') || "00000000-0000-0000-0000-000000000000";

    try {
      await api.post('/abonos/', {
        empresa_id: empresaIdReal,
        prestamo_id: credito.id,
        cobrador_id: cobradorIdReal,
        monto_pagado: montoReal
      });
      
      setPagosCompletados(prev => {
        const acumulado = (prev[credito.id] || 0) + montoReal;
        const nuevosPagos = { ...prev, [credito.id]: acumulado };
        
        localStorage.setItem('abonos_aplicados_hoy', JSON.stringify({
          fecha: obtenerFechaHoy(),
          pagos: nuevosPagos
        }));
        
        return nuevosPagos;
      });

      setAbonosInput(prev => ({ ...prev, [credito.id]: '' }));
      await fetchCreditosActivos();
    } catch (err: any) {
      console.error("Error al procesar pago:", err);
      alert("Error al registrar el pago.");
    } finally {
      setCargandoPagoId(null);
    }
  };

  const renderEstadoBadge = (estado_credito: string, diasMora: number = 0) => {
    switch (estado_credito) {
      case 'AL_DIA': return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-[10px] font-extrabold border border-green-500/30 w-full text-center block">AL DÍA</span>;
      case 'MORA': return <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-[10px] font-extrabold border border-red-500/30 flex items-center justify-center gap-1 w-full"><AlertCircle size={10}/> MORA ({diasMora} DÍAS)</span>;
      case 'PROXIMO':
      case 'PRÓXIMO A PAGAR': return <span className="bg-yellow-500/20 text-[#ffc107] px-2 py-1 rounded text-[10px] font-extrabold border border-[#ffc107]/30 w-full text-center block">PRÓXIMO</span>;
      default: return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-[10px] font-extrabold border border-blue-500/30 w-full text-center block">SIN ESTADO</span>;
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto font-sans pb-10">
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6 mt-2">
        <div>
          <h2 className="text-[26px] font-bold text-white tracking-wide flex items-center gap-3">
            <CreditCard className="text-[#ffc107]" size={28} />
            Liquidación Rápida
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Visualiza cuotas, saldos y registra abonos rápidamente.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por cliente o cédula..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-[#242e42] border border-gray-700 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] transition"
          />
        </div>
      </div>

      <div className="bg-[#242e42] rounded-xl overflow-hidden shadow-md border border-gray-700/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead className="bg-[#1e2738]">
              <tr className="text-[11px] text-gray-400 border-b border-gray-700/30 uppercase tracking-widest">
                <th className="px-4 py-4 font-semibold text-center w-28">ESTADO</th>
                <th className="px-4 py-4 font-semibold">CLIENTE</th>
                <th className="px-2 py-4 font-semibold text-center" title="Cuotas Canceladas">CCan</th>
                <th className="px-2 py-4 font-semibold text-center" title="Cuotas Pendientes">CPen</th>
                <th className="px-4 py-4 font-semibold text-right">CUOTA</th>
                <th className="px-4 py-4 font-semibold text-right">SALDO</th>
                <th className="px-4 py-4 font-semibold text-center bg-[#152D57]">ABONO</th>
                <th className="px-4 py-4 font-semibold text-center">ACCIÓN</th>
                <th className="px-4 py-4 font-semibold text-center text-green-400">APLICADO</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-gray-300">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400 font-medium">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-[#ffc107]" size={24} />
                    Cargando listado de liquidación...
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-400 font-medium">
                    No se encontraron créditos activos.
                  </td>
                </tr>
              ) : (
                filtrados.map((credito) => {
                  const valorCuota = credito.valor_cuota || 1;
                  
                  let ccan = Math.floor((credito.monto_total_pagar - credito.saldo_restante) / valorCuota);
                  let cpen = Math.ceil(credito.saldo_restante / valorCuota);
                  if (ccan < 0) ccan = 0;

                  const isPagarLoading = cargandoPagoId === credito.id;
                  const abonoAplicado = pagosCompletados[credito.id];

                  return (
                    <tr key={credito.id} className={`transition border-b border-gray-700/20 last:border-0 ${abonoAplicado ? 'bg-green-900/10' : 'hover:bg-[#2a354a]'}`}>
                      
                      <td className="px-4 py-3 align-middle">
                        {renderEstadoBadge(credito.estado_credito, credito.dias_mora)}
                      </td>
                      
                      <td className="px-4 py-3 align-middle">
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-[13px]">{credito.cliente_nombre}</span>
                          <span className="text-[10px] text-gray-400 uppercase">
                            {credito.modalidad}
                          </span>
                          
                          {/* BOTONES DE RENOVAR Y REFINANCIAR (SOLO PARA ADMIN) */}
                          {isAdmin && (
                            <div className="flex gap-1.5 mt-1.5">
                              <button
                                onClick={() => {
                                  setCreditoAccion(credito);
                                  setModalRenovarAbierto(true);
                                }}
                                className="bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/40 px-2 py-0.5 rounded text-[9px] font-bold transition uppercase tracking-wider"
                              >
                                Renovar
                              </button>
                              <button
                                onClick={() => {
                                  setCreditoAccion(credito);
                                  setModalRefinanciarAbierto(true);
                                }}
                                className="bg-orange-500/20 text-orange-400 border border-orange-500/30 hover:bg-orange-500/40 px-2 py-0.5 rounded text-[9px] font-bold transition uppercase tracking-wider"
                              >
                                Refinanciar
                              </button>
                            </div>
                          )}

                        </div>
                      </td>

                      <td className="px-2 py-3 text-center align-middle">
                        <span className="bg-green-500/10 text-green-400 font-black text-[13px] px-2 py-1 rounded">
                          {ccan}
                        </span>
                      </td>

                      <td className="px-2 py-3 text-center align-middle">
                        <span className="bg-red-500/10 text-red-400 font-black text-[13px] px-2 py-1 rounded">
                          {cpen}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right font-medium text-gray-400 align-middle">
                        {formatearDinero(credito.valor_cuota || 0)}
                      </td>

                      <td className="px-4 py-3 text-right font-black text-[#ffc107] text-[14px] align-middle">
                        {formatearDinero(credito.saldo_restante)}
                      </td>

                      <td className="px-4 py-3 align-middle bg-[#152D57]/30">
                        <div className="relative w-28 mx-auto">
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <DollarSign size={14} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={abonosInput[credito.id] || ''}
                            onChange={(e) => handleAbonoChange(credito.id, e.target.value)}
                            className="w-full bg-[#151c2c] text-green-400 text-sm font-bold pl-7 pr-2 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 border border-gray-600 text-right"
                            placeholder="0"
                            disabled={isPagarLoading}
                          />
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center align-middle">
                        <button
                          onClick={() => registrarAbonoDirecto(credito)}
                          disabled={isPagarLoading || !abonosInput[credito.id]}
                          className={`w-full py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 uppercase ${
                            isPagarLoading || !abonosInput[credito.id]
                              ? 'bg-gray-600/50 text-gray-500 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-400 text-[#111927] shadow-md'
                          }`}
                        >
                          {isPagarLoading ? (
                            <RefreshCw size={14} className="animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 size={14} /> Aplicar
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-4 py-3 text-center align-middle border-l border-gray-700/30">
                        {abonoAplicado ? (
                          <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-black tracking-wide border border-green-500/30">
                            {formatearDinero(abonoAplicado)} ✓
                          </span>
                        ) : (
                          <span className="text-gray-600 text-xs font-bold">--</span>
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

      {/* MODALES DE RENOVAR Y REFINANCIAR */}
      {creditoAccion && (
        <ModalRenovarCredito
          isOpen={modalRenovarAbierto}
          onClose={() => {
            setModalRenovarAbierto(false);
            setCreditoAccion(null);
          }}
          creditoActivo={creditoAccion}
          onRenovacionExitosa={() => {
            fetchCreditosActivos();
            setCreditoAccion(null);
            alert("¡Crédito renovado exitosamente!");
          }}
        />
      )}

      {creditoAccion && (
        <ModalRefinanciarCredito
          isOpen={modalRefinanciarAbierto}
          onClose={() => {
            setModalRefinanciarAbierto(false);
            setCreditoAccion(null);
          }}
          creditoActivo={creditoAccion}
          clienteId={creditoAccion.cliente_id}
          onRefinanciacionExitosa={() => {
            fetchCreditosActivos();
            setCreditoAccion(null);
            alert("¡Crédito refinanciado con éxito!");
          }}
        />
      )}

    </div>
  );
}