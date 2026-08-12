import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserPlus, CircleDollarSign, LineChart as LucideLineChart, ChevronDown } from 'lucide-react';
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

  const datosGrafica = [
    { name: '5k', valor: 20 },
    { name: '10k', valor: 30 },
    { name: '15k', valor: 55 },
    { name: '20k', valor: 35 },
    { name: '25k', valor: 50 },
    { name: '30k', valor: 85 },
    { name: '35k', valor: 45 },
    { name: '40k', valor: 55 },
    { name: '45k', valor: 75 },
    { name: '50k', valor: 65 },
    { name: '55k', valor: 45 },
    { name: '60k', valor: 60 },
  ];

  // Tooltip con colores corporativos
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-guadalupe-azul border border-guadalupe-amarillo/30 text-guadalupe-amarillo text-xs font-bold px-4 py-2 rounded-lg shadow-xl">
          {payload[0].value}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">

      <h2 className="text-3xl font-extrabold text-guadalupe-blanco mb-8 mt-2 tracking-wide">
        Panel de Control
      </h2>

      {/* 4 Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#242E42] p-6 rounded-2xl shadow-lg border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-guadalupe-gris text-sm font-medium">Total Clientes</h3>
            <User className="text-guadalupe-blanco" size={20} fill="currentColor" />
          </div>
          <p className="text-4xl font-extrabold text-guadalupe-blanco mb-3 tracking-tight">20.000</p>
          <p className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
            <span className="text-[#00E676]">↗ 8.5%</span>
            <span className="text-guadalupe-gris font-normal">Por Encima de ayer</span>
          </p>
        </div>

        <div className="bg-[#242E42] p-6 rounded-2xl shadow-lg border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-guadalupe-gris text-sm font-medium">Total Clientes Nuevos</h3>
            <UserPlus className="text-guadalupe-blanco" size={20} fill="currentColor" />
          </div>
          <p className="text-4xl font-extrabold text-guadalupe-blanco mb-3 tracking-tight">500</p>
          <p className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
            <span className="text-[#00E676]">↗ 1.3%</span>
            <span className="text-guadalupe-gris font-normal">Por encima de la semana pasada</span>
          </p>
        </div>

        <div className="bg-[#242E42] p-6 rounded-2xl shadow-lg border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-guadalupe-gris text-sm font-medium">Gastos día</h3>
            <CircleDollarSign className="text-guadalupe-blanco" size={20} />
          </div>
          <p className="text-4xl font-extrabold text-guadalupe-blanco mb-3 tracking-tight">$100,000</p>
          <p className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
            <span className="text-[#FF3B30]">↘ 4.3%</span>
            <span className="text-guadalupe-gris font-normal">Por debajo de ayer</span>
          </p>
        </div>

        <div className="bg-[#242E42] p-6 rounded-2xl shadow-lg border border-white/5 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-guadalupe-gris text-sm font-medium">Total Ventas</h3>
            <LucideLineChart className="text-guadalupe-blanco" size={20} />
          </div>
          <p className="text-4xl font-extrabold text-guadalupe-blanco mb-3 tracking-tight">100</p>
          <p className="text-xs font-semibold tracking-wide flex items-center gap-1.5">
            <span className="text-[#00E676]">↗ 1.8%</span>
            <span className="text-guadalupe-gris font-normal">Por Encima de ayer</span>
          </p>
        </div>
      </div>

      {/* Gráfica Recharts Dinámica */}
      <div className="bg-[#242E42] rounded-2xl p-7 mb-8 h-[400px] flex flex-col shadow-lg border border-white/5">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-lg font-bold text-guadalupe-blanco tracking-wide">Detalles de Ventas</h3>
          <button className="flex items-center gap-2 bg-[#1A2235] text-guadalupe-blanco/80 rounded-lg px-4 py-2 text-sm font-medium outline-none shadow-sm hover:bg-[#151C2C] transition">
            Julio <ChevronDown size={16} />
          </button>
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datosGrafica} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8E8E93', fontSize: 12, fontWeight: 500 }}
                dy={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8E8E93', fontSize: 12, fontWeight: 500 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#4b5563', strokeWidth: 1, strokeDasharray: '3 3' }} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#FFCC00"
                strokeWidth={3}
                dot={{ r: 4, fill: '#FFCC00', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#FFCC00', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-[#242E42] rounded-2xl overflow-hidden shadow-lg border border-white/5 mb-10">
        <div className="px-7 py-6 flex justify-between items-center border-b border-white/5">
          <h3 className="text-lg font-bold text-guadalupe-blanco tracking-wide">Ventas</h3>
          <button className="flex items-center gap-2 bg-[#1A2235] text-guadalupe-blanco/80 rounded-lg px-4 py-2 text-sm font-medium outline-none shadow-sm hover:bg-[#151C2C] transition">
            Julio <ChevronDown size={16} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#1A2235]/50">
              <tr className="text-sm text-guadalupe-gris border-b border-white/5">
                <th className="px-7 py-4 font-semibold">Nombre Cliente</th>
                <th className="px-7 py-4 font-semibold">Ciudad</th>
                <th className="px-7 py-4 font-semibold">Hora</th>
                <th className="px-7 py-4 font-semibold">Total Crédito</th>
                <th className="px-7 py-4 font-semibold">Ruta</th>
                <th className="px-7 py-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="text-sm text-guadalupe-blanco/90">
              {ventasRecientes.map((venta) => (
                <tr key={venta.id} className="hover:bg-white/5 transition border-b border-white/5 last:border-0">
                  <td className="px-7 py-5 flex items-center gap-3 font-medium">
                    <div className="w-9 h-9 rounded-full bg-guadalupe-gris/20 flex items-center justify-center">
                      <User size={18} className="text-guadalupe-blanco" fill="currentColor" />
                    </div>
                    {venta.cliente}
                  </td>
                  <td className="px-7 py-5 text-guadalupe-gris">{venta.ciudad}</td>
                  <td className="px-7 py-5 text-guadalupe-gris">{venta.hora}</td>
                  <td className="px-7 py-5 font-bold text-guadalupe-blanco">{venta.total}</td>
                  <td className="px-7 py-5 text-guadalupe-gris">{venta.ruta}</td>
                  <td className="px-7 py-5 text-right">
                    <button className="bg-guadalupe-amarillo text-guadalupe-azul font-extrabold px-6 py-2 rounded-xl hover:bg-yellow-400 transition shadow-lg text-sm">
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