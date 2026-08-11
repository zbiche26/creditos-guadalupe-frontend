import React, { useState } from 'react';
import CrearClienteModal from '../components/CrearClienteModal'; // Ajusta la ruta según tu estructura

export default function Clientes() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClientes = () => {
    // Aquí recargas la tabla de clientes después de crear uno nuevo
    console.log("Cliente creado con éxito, recargando tabla...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Clientes</h1>

        {/* Botón que abre el modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#ffc107] text-[#151C2C] font-extrabold px-6 py-2.5 rounded-xl shadow-lg hover:bg-yellow-400 transition text-sm"
        >
          CREAR CLIENTE
        </button>
      </div>

      {/* Aquí va tu tabla o contenido actual de clientes */}

      {/* El Modal montado en la vista */}
      <CrearClienteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClienteCreado={fetchClientes}
      />
    </div>
  );
}