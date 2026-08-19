import { useState, useEffect } from 'react';
import { MapPin, Phone, User, Navigation, ArrowRight, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Definimos la estructura de los datos que nos envía el nuevo endpoint
interface Visita {
  prestamo_id: string;
  cliente_id: string;
  nombre_completo: string;
  direccion: string;
  barrio: string;
  telefono: string;
  cuota_diaria: number;
  saldo_restante: number;
}

export default function EnrutarClientes() {
  const [ruta, setRuta] = useState<Visita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const cargarRuta = async () => {
      setIsLoading(true);
      setError('');
      try {
        const respuesta = await api.get('/rutas/dia');
        // Aseguramos que tomamos la propiedad 'datos' que armamos en Python
        if (respuesta.data && respuesta.data.datos) {
          setRuta(respuesta.data.datos);
        } else {
          setRuta([]);
        }
      } catch (err) {
        console.error("Error al cargar la ruta:", err);
        setError("No se pudo cargar la ruta del día. Revisa la conexión.");
      } finally {
        setIsLoading(false);
      }
    };

    cargarRuta();
  }, []);

  // Función para formatear dinero fácil de leer
  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto font-sans pb-10">

      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6 mt-2">
        <div>
          <h2 className="text-[26px] font-bold text-white tracking-wide">Ruta del Día</h2>
          <p className="text-gray-400 text-sm mt-1">
            {ruta.length} clientes pendientes de visita hoy.
          </p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="bg-gray-800 text-gray-300 p-3 rounded-full hover:bg-gray-700 transition shadow-lg"
          title="Actualizar Ruta"
        >
          <Navigation size={20} className="text-[#ffc107]" />
        </button>
      </div>

      {/* Estados de Carga y Error */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffc107]"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {!isLoading && !error && ruta.length === 0 && (
        <div className="bg-[#242e42] rounded-xl p-10 text-center border border-gray-700/20 shadow-md">
          <Navigation size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">¡Día Libre!</h3>
          <p className="text-gray-400">No hay clientes con créditos activos en la ruta de hoy.</p>
        </div>
      )}

      {/* Lista de Tarjetas (Grid para PC, Lista para Móvil) */}
      {!isLoading && !error && ruta.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ruta.map((visita, index) => (
            <div
              key={visita.prestamo_id}
              className="bg-[#242e42] rounded-xl overflow-hidden border border-gray-700/30 shadow-lg flex flex-col hover:border-gray-500/50 transition-colors"
            >
              {/* Cabecera de la Tarjeta */}
              <div className="bg-[#1e2738] p-4 flex justify-between items-start border-b border-gray-700/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-[#ffc107] font-bold text-lg shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-[15px] leading-tight truncate max-w-[200px] uppercase">
                      {visita.nombre_completo}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                      <Phone size={12} /> {visita.telefono}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cuerpo de la Tarjeta */}
              <div className="p-5 flex-grow flex flex-col gap-3">
                <div className="flex items-start gap-2.5">
                  <MapPin size={16} className="text-[#ffc107] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-gray-200 text-sm font-medium uppercase">{visita.direccion}</p>
                    <p className="text-gray-500 text-xs mt-0.5">Barrio: {visita.barrio}</p>
                  </div>
                </div>

                <div className="bg-[#1a2235] rounded-lg p-3 mt-2 grid grid-cols-2 gap-2 border border-gray-700/30">
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Cuota de Hoy</p>
                    <p className="text-green-400 font-bold text-sm">
                      {formatearDinero(visita.cuota_diaria)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Saldo Total</p>
                    <p className="text-white font-semibold text-sm">
                      {formatearDinero(visita.saldo_restante)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botón de Acción */}
              <button
                // Navegamos al perfil del cliente para cobrarle
                onClick={() => navigate(`/clientes/${visita.cliente_id}/creditos`)}
                className="bg-[#ffc107]/10 hover:bg-[#ffc107]/20 text-[#ffc107] w-full py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-colors border-t border-[#ffc107]/20"
              >
                <Wallet size={16} /> Ir a Cobrar <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}