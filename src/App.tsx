import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Layout from './components/Layout';
import ClientesNuevos from './pages/ClientesNuevos';
import CreditosCliente from './pages/CreditosCliente'; // <-- 1. IMPORTAMOS LA NUEVA PANTALLA

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas que usan el Layout (Barra lateral y superior) */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/clientes/nuevos" element={<ClientesNuevos />} />

          {/* <-- 2. NUEVA RUTA: La ponemos dentro del Layout para mantener el menú */}
          <Route path="/clientes/:id/creditos" element={<CreditosCliente />} />
        </Route>

        {/* Ruta comodín: Si la URL no existe, expulsa al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;