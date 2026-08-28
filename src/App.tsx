import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Layout from './components/Layout';
import ClientesNuevos from './pages/ClientesNuevos';
import CreditosCliente from './pages/CreditosCliente';
import EnrutarClientes from './pages/EnrutarClientes';
import Gastos from './pages/Gastos';
import TotalizarVentas from './pages/TotalizarVentas';
import ActualizarDatos from './pages/ActualizarDatos';
import Calendario from './pages/Calendario';
import Configuracion from './pages/Configuracion';
import Ventas from './pages/Ventas';
import CrearVenta from './pages/CrearVenta';
import ClientesEnMora from './pages/ClientesEnMora';
import HistorialGlobalCreditos from './pages/HistorialGlobalCreditos';

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
          <Route path="/clientes/actualizar" element={<ActualizarDatos />} />
          <Route path="/clientes/mora" element={<ClientesEnMora />} />
          <Route path="/clientes/:id/creditos" element={<CreditosCliente />} />
          <Route path="/creditos/historial" element={<HistorialGlobalCreditos />} />
          
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/enrutar" element={<EnrutarClientes />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/gastos" element={<Gastos />} />
          <Route path="/totalizar-ventas" element={<TotalizarVentas />} />
          <Route path="/ventas/crear" element={<CrearVenta />} />
        </Route>
        
        {/* Ruta comodín por si escriben una URL que no existe */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;