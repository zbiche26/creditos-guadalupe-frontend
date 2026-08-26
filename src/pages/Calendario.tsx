import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, DollarSign, MapPin } from 'lucide-react';
import api from '../services/api';

interface DiaProyeccion {
  fecha: string;
  dia: number;
  es_domingo: boolean;
  visitas: number;
  recaudo_esperado: number;
}

export default function Calendario() {
  const [fechaActual, setFechaActual] = useState(new Date());
  const [datosMes, setDatosMes] = useState<DiaProyeccion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const cargarProyeccion = async (mes: number, anio: number) => {
    setIsLoading(true);
    try {
      const respuesta = await api.get('/calendario/proyeccion', {
        params: { mes, anio }
      });
      setDatosMes(respuesta.data.datos || []);
    } catch (error) {
      console.error("Error al cargar el calendario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarProyeccion(fechaActual.getMonth() + 1, fechaActual.getFullYear());
  }, [fechaActual]);

  const irMesAnterior = () => {
    setFechaActual(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const irMesSiguiente = () => {
    setFechaActual(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const formatearDinero = (monto: number) => {
    if (monto === 0) return '$ 0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(monto);
  };

  const obtenerDiasVacios = () => {
    const primerDiaDelMes = new Date(fechaActual.getFullYear(), fechaActual.getMonth(), 1);
    let diaSemana = primerDiaDelMes.getDay();
    diaSemana = diaSemana === 0 ? 6 : diaSemana - 1;
    return Array(diaSemana).fill(null);
  };

  const diasSemana = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
  
  const totalRecaudoMes = datosMes.reduce((suma, dia) => suma + dia.recaudo_esperado, 0);
  const totalVisitasMes = datosMes.reduce((suma, dia) => suma + dia.visitas, 0);

  return (
    <div className="w-full max-w-[1200px] mx-auto font-sans pb-10 mt-2">
      
      {/* Encabezado y Totales */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <CalendarIcon className="text-[#ffc107]" size={32} /> Calendario de Cobros
          </h1>
          <p className="text-gray-400 mt-2">Proyección visual de rutas y recaudos del mes.</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#242e42] border border-gray-700/50 px-6 py-3 rounded-xl shadow-lg text-center">
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">Visitas del Mes</p>
            <p className="text-white text-xl font-bold">{totalVisitasMes}</p>
          </div>
          <div className="bg-[#242e42] border border-gray-700/50 px-6 py-3 rounded-xl shadow-lg text-center">
            <p className="text-gray-400 text-xs font-bold uppercase mb-1">Proyección Recaudo</p>
            <p className="text-[#10b981] text-xl font-bold">{formatearDinero(totalRecaudoMes)}</p>
          </div>
        </div>
      </div>

      {/* Controles del Calendario */}
      <div className="bg-[#1e2738] rounded-t-2xl p-4 border border-gray-700/50 flex justify-between items-center">
        <button 
          onClick={irMesAnterior}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
        >
          <ChevronLeft size={24} />
        </button>
        
        <h2 className="text-xl font-extrabold text-white uppercase tracking-wider">
          {meses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
        </h2>
        
        <button 
          onClick={irMesSiguiente}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Cuadrícula del Calendario */}
      <div className="bg-[#242e42] border-x border-b border-gray-700/50 rounded-b-2xl shadow-xl overflow-hidden">
        
        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b border-gray-700/50">
          {diasSemana.map((dia, i) => (
            <div key={dia} className={`text-center py-3 text-xs font-bold ${i === 6 ? 'text-red-400' : 'text-gray-400'}`}>
              {dia}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        {isLoading ? (
          <div className="p-20 text-center text-gray-400 flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ffc107] mb-4"></div>
            Calculando proyecciones del mes...
          </div>
        ) : (
          <div key={`${fechaActual.getMonth()}-${fechaActual.getFullYear()}`} className="grid grid-cols-7 auto-rows-fr">
            {obtenerDiasVacios().map((_, i) => (
              <div key={`vacio-${i}`} className="min-h-[120px] bg-[#1a2235]/50 border-r border-b border-gray-700/30"></div>
            ))}
            
            {datosMes.map((dia) => {
              const esHoy = new Date().toISOString().split('T')[0] === dia.fecha;
              
              return (
                <div 
                  key={dia.fecha} 
                  className={`min-h-[120px] p-2 sm:p-3 border-r border-b border-gray-700/30 flex flex-col transition-colors
                    ${dia.es_domingo ? 'bg-red-900/10' : 'hover:bg-white/5'}
                    ${esHoy ? 'bg-[#ffc107]/10 ring-inset ring-2 ring-[#ffc107]/50 relative' : ''}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full
                      ${esHoy ? 'bg-[#ffc107] text-[#111927]' : dia.es_domingo ? 'text-red-400' : 'text-white'}
                    `}>
                      {dia.dia}
                    </span>
                  </div>

                  {!dia.es_domingo && dia.visitas > 0 && (
                    <div className="mt-auto space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-[#ffc107] bg-[#ffc107]/10 px-2 py-1 rounded-md font-semibold">
                        <DollarSign size={12} />
                        <span className="truncate">{formatearDinero(dia.recaudo_esperado)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-md font-medium">
                        <MapPin size={12} />
                        <span>{dia.visitas} rutas</span>
                      </div>
                    </div>
                  )}

                  {dia.es_domingo && (
                    <div className="mt-auto text-[10px] text-red-400/50 uppercase font-bold text-center tracking-widest">
                      Descanso
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}