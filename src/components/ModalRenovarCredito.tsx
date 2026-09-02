import { useState, useEffect } from 'react';
import { X, DollarSign, Calculator, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

interface ModalRenovarProps {
  isOpen: boolean;
  onClose: () => void;
  creditoActivo: any;
  onRenovacionExitosa: () => void;
}

export default function ModalRenovarCredito({ isOpen, onClose, creditoActivo, onRenovacionExitosa }: ModalRenovarProps) {
  // Manejamos el monto como texto para poder ponerle los puntos (ej: "1.000.000")
  const [montoInput, setMontoInput] = useState<string>('');
  const [porcentaje, setPorcentaje] = useState<string>('20');
  const [cuotas, setCuotas] = useState<string>('24');
  const [modalidad, setModalidad] = useState('DIARIO');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMontoInput('');
      setPorcentaje('20');
      setCuotas('24');
      setModalidad(creditoActivo?.modalidad || 'DIARIO');
      setError('');
    }
  }, [isOpen, creditoActivo]);

  if (!isOpen || !creditoActivo) return null;

  // Formateador de dinero general (con signo $)
  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(monto || 0);
  };

  // Función mágica para ponerle puntos al input mientras escribes
  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Quitamos todo lo que no sea número
    const soloNumeros = e.target.value.replace(/\D/g, '');
    if (!soloNumeros) {
      setMontoInput('');
      return;
    }
    // Formateamos con el estándar local de Colombia (con puntos)
    const numeroFormateado = new Intl.NumberFormat('es-CO').format(parseInt(soloNumeros, 10));
    setMontoInput(numeroFormateado);
  };

  // Función para evitar ceros a la izquierda en las cuotas (ej. de 020 a 20)
  const handleCuotasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/\D/g, '');
    setCuotas(soloNumeros ? parseInt(soloNumeros, 10).toString() : '');
  };

  // Cálculos matemáticos limpios
  const saldoPendiente = parseFloat(creditoActivo.saldo_restante || 0);
  // Le quitamos los puntos al string para volverlo un número real que entienda la matemática
  const prestamoNum = parseInt(montoInput.replace(/\./g, '')) || 0; 
  const porcNum = parseInt(porcentaje) || 0;
  const cuotasNum = parseInt(cuotas) || 0;
  
  const montoTotalPagar = prestamoNum + (prestamoNum * (porcNum / 100));
  const valorCuota = cuotasNum > 0 ? montoTotalPagar / cuotasNum : 0;
  const efectivoEntregar = prestamoNum - saldoPendiente;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (prestamoNum <= 0) {
      setError("El nuevo monto a prestar debe ser mayor a cero.");
      return;
    }
    
    if (efectivoEntregar < 0) {
      setError(`El préstamo debe ser mayor a la deuda actual (${formatearDinero(saldoPendiente)}) para poder renovar.`);
      return;
    }

    setIsLoading(true);

    try {
      await api.post(`/creditos/${creditoActivo.id}/renovar`, {
        nuevo_monto_prestado: prestamoNum,
        nuevo_monto_total_pagar: montoTotalPagar,
        numero_cuotas: cuotasNum,
        modalidad: modalidad,
        valor_cuota: valorCuota
      });

      onRenovacionExitosa();
      onClose();
    } catch (err: any) {
      console.error("Error al renovar:", err);
      setError(err.response?.data?.detail || "Ocurrió un error al intentar renovar el crédito.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] overflow-y-auto">
      <div className="bg-[#0f1522] rounded-2xl w-full max-w-2xl relative shadow-2xl border border-gray-700/50 my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-full transition"
        >
          <X size={24} />
        </button>

        <div className="p-6 border-b border-white/10 bg-[#152D57] rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calculator className="text-[#ffc107]" size={28} />
            Renovar Crédito
          </h2>
          <p className="text-white/70 text-sm mt-1">
            Liquida la deuda actual y genera un nuevo préstamo al instante.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm flex items-start gap-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wider">
                  Nuevo Monto a Prestar ($)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text" // Cambiado a text para permitir los puntos
                    required
                    className="w-full bg-[#1a2235] border border-gray-600 text-white text-lg px-10 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107] transition font-bold"
                    placeholder="Ej. 1.000.000"
                    value={montoInput}
                    onChange={handleMontoChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wider">
                    Interés (%)
                  </label>
                  <input
                    type="text" // Cambiado a text para mejor control
                    required
                    className="w-full bg-[#1a2235] border border-gray-600 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
                    value={porcentaje}
                    onChange={(e) => setPorcentaje(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wider">
                    Modalidad
                  </label>
                  <select
                    className="w-full bg-[#1a2235] border border-gray-600 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
                    value={modalidad}
                    onChange={(e) => setModalidad(e.target.value)}
                  >
                    <option value="DIARIO">Diario</option>
                    <option value="SEMANAL">Semanal</option>
                    <option value="MENSUAL">Mensual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold mb-1.5 uppercase tracking-wider">
                  Número de Cuotas
                </label>
                <input
                  type="text" // Texto para matar el '020'
                  required
                  className="w-full bg-[#1a2235] border border-gray-600 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ffc107]"
                  value={cuotas}
                  onChange={handleCuotasChange}
                />
              </div>

            </div>

            <div className="bg-[#1a2235] rounded-2xl p-5 border border-gray-700/50 flex flex-col justify-center">
              <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm flex items-center gap-2 border-b border-gray-700 pb-2">
                Resumen de la Operación
              </h3>
              
              <div className="space-y-3 flex-1">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Deuda actual a cancelar:</span>
                  <span className="text-red-400 font-bold">{formatearDinero(saldoPendiente)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Total nueva deuda:</span>
                  <span className="text-white font-bold">{formatearDinero(montoTotalPagar)}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Valor de nueva cuota:</span>
                  <span className="text-white font-bold">{formatearDinero(valorCuota)}</span>
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-xl border-2 text-center transition-colors ${efectivoEntregar >= 0 ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <p className={`text-xs font-black uppercase mb-1 tracking-widest ${efectivoEntregar >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  Efectivo a entregar al cliente
                </p>
                <p className={`text-3xl font-black ${efectivoEntregar >= 0 ? 'text-white' : 'text-red-500'}`}>
                  {efectivoEntregar >= 0 ? formatearDinero(efectivoEntregar) : 'Faltan fondos'}
                </p>
                {efectivoEntregar >= 0 && (
                  <div className="flex items-center justify-center gap-1 text-green-400 mt-2 text-xs">
                    <CheckCircle size={14} /> Listo para desembolsar
                  </div>
                )}
              </div>

            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-full text-sm font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 transition"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || efectivoEntregar < 0 || prestamoNum <= 0}
              className={`px-8 py-2.5 rounded-full text-sm font-black transition shadow-lg ${
                isLoading || efectivoEntregar < 0 || prestamoNum <= 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-[#ffc107] text-[#111927] hover:bg-yellow-400'
              }`}
            >
              {isLoading ? 'Procesando...' : 'Confirmar Renovación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}