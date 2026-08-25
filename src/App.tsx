import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Layout from './components/Layout';
import ClientesNuevos from './pages/ClientesNuevos';
import CreditosCliente from './pages/CreditosCliente';
import EnrutarClientes from './pages/EnrutarClientes';
import Gastos from './pages/Gastos';
import TotalizarVentas from './pages/TotalizarVentas'; // <--- 1. IMPORTAMOS LA PÁGINA DE LIQUIDACIÓN

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
          <Route path="/clientes/:id/creditos" element={<CreditosCliente />} />
          <Route path="/enrutar" element={<EnrutarClientes />} />
          <Route path="/gastos" element={<Gastos />} />
          
          {/* <--- 2. AGREGAMOS LA RUTA DE TOTALIZAR VENTAS AQUÍ DENTRO ---> */}
          <Route path="/totalizar-ventas" element={<TotalizarVentas />} />
        </Route>

        {/* Ruta comodín: Si la URL no existe, expulsa al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;