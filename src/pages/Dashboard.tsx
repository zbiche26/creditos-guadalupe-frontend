import { useState, useEffect } from 'react';
import { Users, Wallet, TrendingUp, AlertCircle, Navigation, TrendingDown, DollarSign } from 'lucide-react';
import api from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_clientes: 0,
    cartera_activa: 0,
    recaudo_hoy: 0,
    gastos_hoy: 0, // <-- Nuevo estado
    clientes_pendientes_hoy: 0,
    grafica_etiquetas: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    grafica_datos: [0, 0, 0, 0, 0, 0, 0]
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const respuesta = await api.get('/estadisticas/panel');
        setStats(respuesta.data);
      } catch (err) {
        console.error("Error al cargar estadísticas:", err);
        setError("No se pudieron cargar las estadísticas. Verifica tu conexión.");
      } finally {
        setIsLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(monto);
  };

  const chartData = {
    labels: stats.grafica_etiquetas,
    datasets: [
      {
        label: 'Recaudo ($)',
        data: stats.grafica_datos,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#1A2235',
        pointBorderColor: '#10b981',
        pointHoverBackgroundColor: '#10b981',
        pointHoverBorderColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e2738',
        titleColor: '#9ca3af',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#9ca3af',
          callback: function(value: any) {
            return '$' + value / 1000 + 'k';
          }
        }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' }
      }
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto font-sans pb-10 mt-2">
      <h1 className="text-3xl font-bold text-white mb-8">Panel de Control</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-6 shadow-sm">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {/* Grid de Tarjetas de Resumen (5 Columnas para acomodar Clientes, Cartera, Recaudo, Gastos y Pendientes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">

        {/* Tarjeta 1: Total Clientes */}
        <div className="bg-[#242e42] rounded-2xl p-5 shadow-lg border border-gray-700/30 relative overflow-hidden hover:border-gray-500/50 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-400 font-medium text-sm">Total Clientes</h3>
            <div className="p-2 bg-white/5 rounded-lg text-gray-300">
              <Users size={18} />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 w-20 bg-white/10 animate-pulse rounded mb-2"></div>
          ) : (
            <h2 className="text-3xl font-bold text-white mb-1">{stats.total_clientes}</h2>
          )}
          <p className="text-[#10b981] text-[11px] font-semibold">Registrados</p>
        </div>

        {/* Tarjeta 2: Cartera Activa */}
        <div className="bg-[#242e42] rounded-2xl p-5 shadow-lg border border-gray-700/30 relative overflow-hidden hover:border-gray-500/50 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-400 font-medium text-sm">Cartera Activa</h3>
            <div className="p-2 bg-white/5 rounded-lg text-gray-300">
              <Wallet size={18} />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 w-24 bg-white/10 animate-pulse rounded mb-2"></div>
          ) : (
            <h2 className="text-2xl font-bold text-white mb-1">{formatearDinero(stats.cartera_activa)}</h2>
          )}
          <p className="text-[#ffc107] text-[11px] font-semibold">Capital en la calle</p>
        </div>

        {/* Tarjeta 3: Recaudo Hoy */}
        <div className="bg-[#242e42] rounded-2xl p-5 shadow-lg border border-gray-700/30 relative overflow-hidden hover:border-gray-500/50 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-400 font-medium text-sm">Recaudo Hoy</h3>
            <div className="p-2 bg-[#10b981]/10 rounded-lg text-[#10b981]">
              <TrendingUp size={18} />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 w-24 bg-white/10 animate-pulse rounded mb-2"></div>
          ) : (
            <h2 className="text-2xl font-bold text-white mb-1">{formatearDinero(stats.recaudo_hoy)}</h2>
          )}
          <p className="text-[#10b981] text-[11px] font-semibold">Ingresos en caja</p>
        </div>

        {/* Tarjeta 4: Gastos de Hoy */}
        <div className="bg-[#242e42] rounded-2xl p-5 shadow-lg border border-gray-700/30 relative overflow-hidden hover:border-gray-500/50 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-400 font-medium text-sm">Gastos de Hoy</h3>
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <TrendingDown size={18} />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 w-24 bg-white/10 animate-pulse rounded mb-2"></div>
          ) : (
            <h2 className="text-2xl font-bold text-white mb-1">{formatearDinero(stats.gastos_hoy)}</h2>
          )}
          <p className="text-red-400 text-[11px] font-semibold">Salidas de dinero</p>
        </div>

        {/* Tarjeta 5: Pendientes Hoy */}
        <div className="bg-[#242e42] rounded-2xl p-5 shadow-lg border border-gray-700/30 relative overflow-hidden hover:border-gray-500/50 transition-colors">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-400 font-medium text-sm">Pendientes Hoy</h3>
            <div className="p-2 bg-amber-500/10 rounded-lg text-[#ffc107]">
              <Navigation size={18} />
            </div>
          </div>
          {isLoading ? (
            <div className="h-8 w-20 bg-white/10 animate-pulse rounded mb-2"></div>
          ) : (
            <h2 className="text-3xl font-bold text-white mb-1">{stats.clientes_pendientes_hoy}</h2>
          )}
          <p className="text-[#ffc107] text-[11px] font-semibold">Visitas asignadas</p>
        </div>

      </div>

      {/* Gráfica de Rendimiento Semanal */}
      <div className="bg-[#242e42] rounded-2xl p-6 shadow-lg border border-gray-700/30 h-[380px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Rendimiento Semanal</h3>
            <p className="text-gray-400 text-sm mt-1">Evolución de los recaudos en los últimos 7 días</p>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          {isLoading ? (
            <div className="w-full h-full bg-white/5 animate-pulse rounded-xl"></div>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      </div>

    </div>
  );
}