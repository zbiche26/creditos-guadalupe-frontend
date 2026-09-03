import React, { useState } from 'react';
import { X, Calculator, AlertTriangle } from 'lucide-react';
import api from '../services/api';

interface ModalRefinanciarProps {
  isOpen: boolean;
  onClose: () => void;
  creditoActivo: any;
  clienteId: string;
  onRefinanciacionExitosa: () => void;
}

export default function ModalRefinanciarCredito({ isOpen, onClose, creditoActivo, clienteId, onRefinanciacionExitosa }: ModalRefinanciarProps) {
  const [interes, setInteres] = useState('20');
  const [modalidad, setModalidad] = useState('DIARIO');
  const [cuotas, setCuotas] = useState('24');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !creditoActivo) return null;

  // --- CÁLCULOS MATEMÁTICOS ---
  const capitalBase = parseFloat(creditoActivo.saldo_restante) || 0;
  const interesNum = parseFloat(interes) || 0;
  const cuotasNum = parseInt(cuotas, 10) || 0;

  const nuevoInteres = capitalBase * (interesNum / 100);
  const nuevoTotalPagar = capitalBase + nuevoInteres;
  const nuevaCuota = cuotasNum > 0 ? Math.round(nuevoTotalPagar / cuotasNum) : 0;

  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(monto || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const empresaIdReal = localStorage.getItem('empresa_id');
    if (!empresaIdReal) {
      alert("Error: No se encontró la sesión activa.");
      return;
    }

    if (capitalBase <= 0) {
      alert("Este crédito no tiene saldo para refinanciar.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/prestamos/refinanciar', {
        prestamo_id: creditoActivo.id,
        empresa_id: empresaIdReal,
        cliente_id: clienteId,
        tasa_interes: interesNum,
        numero_cuotas: cuotasNum,
        modalidad: modalidad
      });

      onRefinanciacionExitosa();
      onClose();
    } catch (err: any) {
      console.error("Error al refinanciar:", err);
      alert("Error: " + (err.response?.data?.detail || "Ocurrió un error al refinanciar el crédito"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
      <div className="bg-[#1e2738] rounded-2xl w-full max-w-md relative shadow-2xl overflow-hidden border border-orange-500/30">
        
        <div className="bg-[#151c2c] px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <AlertTriangle size={18} className="text-orange-500" /> Refinanciar Crédito
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-6 text-center">
            <p className="text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">Deuda Actual (Capital Base)</p>
            <p className="text-2xl font-black text-white">{formatearDinero(capitalBase)}</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Nuevo Interés (%)</label>
                <input
                  type="number"
                  required
                  className="w-full bg-[#151c2c] text-white text-sm font-semibold px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700 transition"
                  value={interes}
                  onChange={(e) => setInteres(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Modalidad</label>
                <select
                  className="w-full bg-[#151c2c] text-white text-sm font-semibold px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700"
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
              <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide">Número de Cuotas</label>
              <input
                type="number"
                required
                className="w-full bg-[#151c2c] text-white text-sm font-semibold px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700 transition"
                value={cuotas}
                onChange={(e) => setCuotas(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-[#151c2c] p-4 rounded-xl border border-gray-700/50 mt-6">
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="text-gray-400 font-medium">Nueva cuota proyectada:</span>
              <span className="text-white font-bold">{formatearDinero(nuevaCuota)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
              <span className="text-orange-400 font-bold uppercase text-xs tracking-wider">Nueva Deuda Total:</span>
              <span className="text-lg font-black text-white">{formatearDinero(nuevoTotalPagar)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || capitalBase <= 0}
            className={`w-full mt-6 font-extrabold text-sm py-4 rounded-xl shadow-lg uppercase tracking-widest transition flex items-center justify-center gap-2 ${
              isSubmitting || capitalBase <= 0 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-orange-500 text-[#111927] hover:bg-orange-400'
            }`}
          >
            <Calculator size={18} /> Confirmar Refinanciación
          </button>
        </form>

      </div>
    </div>
  );
}