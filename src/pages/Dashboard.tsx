import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí luego borraremos el token de sesión
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Barra de Navegación (Navbar) */}
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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Resumen General</h2>

        {/* Tarjetas de Estadísticas (Placeholder) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-gray-500 text-sm font-semibold">Total Créditos Activos</h3>
            <p className="text-3xl font-bold text-[#0c1928] mt-2">0</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-gray-500 text-sm font-semibold">Capital Prestado</h3>
            <p className="text-3xl font-bold text-[#0c1928] mt-2">$0.00</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-gray-500 text-sm font-semibold">Cuotas en Mora</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">0</p>
          </div>
        </div>
      </main>

    </div>
  );
}