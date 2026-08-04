import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  // Datos de prueba (luego vendrán de tu base de datos)
  const creditosRecientes = [
    { id: 1, cliente: "Juan Pérez", monto: "$500,000", estado: "Al día", fecha: "01/08/2026" },
    { id: 2, cliente: "María Gómez", monto: "$1,200,000", estado: "En mora", fecha: "25/07/2026" },
    { id: 3, cliente: "Carlos Ruiz", monto: "$300,000", estado: "Al día", fecha: "03/08/2026" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Barra de Navegación */}
      <nav className="bg-[#0c1928] text-white shadow-lg border-b border-[#d59d47]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-xl font-bold tracking-wide text-[#d59d47]">
                Créditos Guadalupe
              </h1>
              <span className="bg-[#1e3a5f] text-xs px-2 py-1 rounded text-gray-300">Panel Gerencial</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-gray-300 hover:text-white transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Encabezado del Dashboard y Botón de Acción */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Resumen General</h2>
          <button className="bg-[#d59d47] text-[#0c1928] font-bold py-2 px-6 rounded-lg hover:bg-[#eeb153] transition shadow-md">
            + Nuevo Crédito
          </button>
        </div>

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-semibold">Total Créditos Activos</h3>
            <p className="text-3xl font-bold text-[#0c1928] mt-2">142</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-semibold">Capital Prestado</h3>
            <p className="text-3xl font-bold text-[#0c1928] mt-2">$45.5M</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-semibold">Cuotas en Mora</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">12</p>
          </div>
        </div>

        {/* Tabla de Créditos Recientes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-bold text-gray-800">Créditos Recientes</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-sm text-gray-500">
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Cliente</th>
                  <th className="px-6 py-4 font-semibold">Monto</th>
                  <th className="px-6 py-4 font-semibold">Fecha</th>
                  <th className="px-6 py-4 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {creditosRecientes.map((credito) => (
                  <tr key={credito.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">#{credito.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{credito.cliente}</td>
                    <td className="px-6 py-4">{credito.monto}</td>
                    <td className="px-6 py-4 text-gray-500">{credito.fecha}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        credito.estado === 'Al día'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {credito.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}