import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Herramienta de React Router para cambiar de página
  const navigate = useNavigate();

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue
    console.log("Intentando ingresar con:", email, password);

    // Por ahora, al hacer clic simulamos el éxito y vamos al dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* Tarjeta central */}
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700">Créditos Guadalupe</h1>
          <p className="text-gray-500 mt-2">Ingresa tus credenciales para continuar</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Campo Correo */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="admin@guadalupe.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 transition duration-300 shadow-md"
          >
            Iniciar Sesión
          </button>

        </form>
      </div>
    </div>
  );
}