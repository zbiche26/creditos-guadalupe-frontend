import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserPlus, CircleDollarSign, LineChart as LucideLineChart, ChevronDown } from 'lucide-react';
// Importamos lo necesario de Recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();

  const [estadisticas, setEstadisticas] = useState({
    cartera_activa_total: 0,
    recaudo_hoy: 0,
  });

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const response = await api.get('/estadisticas/');
        setEstadisticas(response.data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);
      }
    };
    cargarEstadisticas();
  }, [navigate]);

  const ventasRecientes = [
    { id: 1, cliente: "Maria Salazar", ciudad: "Manizales, Caldas", hora: "12.07.2026 - 12:53 PM", total: "423", ruta: "02" },
  ];

  // Datos simulados para la gráfica (simulando los picos de tu diseño)
  const datosGrafica = [
    { name: '5k', valor: 20 },
    { name: '10k', valor: 30 },
    { name: '15k', valor: 55 },
    { name: '20k', valor: 35 },
    { name: '25k', valor: 50 },
    { name: '30k', valor: 85 }, // El pico más alto
    { name: '35k', valor: 45 },
    { name: '40k', valor: 55 },
    { name: '45k', valor: 75 },
    { name: '50k', valor: 65 },
    { name: '55k', valor: 45 },
    { name: '60k', valor: 60 },
  ];

  // Personalización del cuadrito que sale al pasar el mouse (Tooltip)
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#3b82f6] text-white text-xs font-bold px-3 py-1.5 rounded shadow-lg">
          {payload[0].value}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">

      <h2 className="text-[26px] font-bold text-white mb-6 mt-2 tracking-wide">Panel de Control</h2>

      {/* 4 Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#242e42] p-5 rounded-xl shadow-md border border-gray-700/20">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-400 text-[13px] font-medium">Total Clientes</h3>
            <User className="text-white" size={20} fill="currentColor" />
          </div>
          <p className="text-3xl font-bold text-white mb-3 tracking-tight">20.000</p>
          <p className="text-xs font-semibold tracking-wide">
            <span className="text-[#00e676]">↗ 8.5%</span> <span className="text-gray-400 font-normal ml-1">Por Encima de ayer</span>
          </p>
        </div>

        <div className="bg-[#242e42] p-5 rounded-xl shadow-md border border-gray-700/20">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-400 text-[13px] font-medium">Total Clientes Nuevos</h3>
            <UserPlus className="text-white" size={20} fill="currentColor" />
          </div>
          <p className="text-3xl font-bold text-white mb-3 tracking-tight">500</p>
          <p className="text-xs font-semibold tracking-wide">
            <span className="text-[#00e676]">↗ 1.3%</span> <span className="text-gray-400 font-normal ml-1">Por encima de la semana pasada</span>
          </p>
        </div>

        <div className="bg-[#242e42] p-5 rounded-xl shadow-md border border-gray-700/20">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-400 text-[13px] font-medium">Gastos día</h3>
            <CircleDollarSign className="text-white" size={20} />
          </div>
          <p className="text-3xl font-bold text-white mb-3 tracking-tight">$100,000</p>
          <p className="text-xs font-semibold tracking-wide">
            <span className="text-[#ef4444]">↘ 4.3%</span> <span className="text-gray-400 font-normal ml-1">Por debajo de ayer</span>
          </p>
        </div>

        <div className="bg-[#242e42] p-5 rounded-xl shadow-md border border-gray-700/20">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-400 text-[13px] font-medium">Total Ventas</h3>
            <LucideLineChart className="text-white" size={20} />
          </div>
          <p className="text-3xl font-bold text-white mb-3 tracking-tight">100</p>
          <p className="text-xs font-semibold tracking-wide">
            <span className="text-[#00e676]">↗ 1.8%</span> <span className="text-gray-400 font-normal ml-1">Por Enecima de ayer</span>
          </p>
        </div>
      </div>

      {/* Gráfica Recharts Dinámica */}
      <div className="bg-[#242e42] rounded-xl p-6 mb-8 h-[380px] flex flex-col shadow-md border border-gray-700/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[17px] font-bold text-white tracking-wide">Detalles de Ventas</h3>
          <button className="flex items-center gap-2 bg-[#1b2333] text-gray-300 rounded-lg px-4 py-1.5 text-sm outline-none shadow-sm hover:bg-[#20293d] transition">
            Julio <ChevronDown size={14} />
          </button>
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosGrafica} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.4} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#ffc107"
                strokeWidth={2}
                dot={{ r: 3, fill: '#ffc107', strokeWidth: 0 }}
                activeDot={{ r: 5, fill: '#ffc107', stroke: '#ffffff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Ventas (Se mantiene igual) */}
      <div className="bg-[#242e42] rounded-xl overflow-hidden shadow-md border border-gray-700/20">
        <div className="px-6 py-5 flex justify-between items-center">
          <h3 className="text-[17px] font-bold text-white tracking-wide">Ventas</h3>
          <button className="flex items-center gap-2 bg-[#1b2333] text-gray-300 rounded-lg px-4 py-1.5 text-sm outline-none shadow-sm hover:bg-[#20293d] transition">
            Julio <ChevronDown size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1e2738]">
              <tr className="text-[13px] text-gray-400 border-b border-gray-700/30">
                <th className="px-6 py-4 font-semibold font-sans">Nombre Cliente</th>
                <th className="px-6 py-4 font-semibold font-sans">Ciudad</th>
                <th className="px-6 py-4 font-semibold font-sans">Hora</th>
                <th className="px-6 py-4 font-semibold font-sans">Total Crédito</th>
                <th className="px-6 py-4 font-semibold font-sans">Ruta</th>
                <th className="px-6 py-4 font-semibold font-sans"></th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-gray-300">
              {ventasRecientes.map((venta) => (
                <tr key={venta.id} className="hover:bg-[#2a354a] transition border-b border-gray-700/20 last:border-0">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                      <User size={16} className="text-white" fill="currentColor" />
                    </div>
                    {venta.cliente}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{venta.ciudad}</td>
                  <td className="px-6 py-4 text-gray-400">{venta.hora}</td>
                  <td className="px-6 py-4 font-medium text-white">{venta.total}</td>
                  <td className="px-6 py-4 text-gray-400">{venta.ruta}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="bg-[#ffc107] text-[#111927] font-bold px-6 py-1.5 rounded-full hover:bg-yellow-400 transition shadow-md text-sm">
                      Acceder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}