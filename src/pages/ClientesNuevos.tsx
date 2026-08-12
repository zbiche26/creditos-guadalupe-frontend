import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClientesNuevos() {
  return (
    // Contenedor principal transparente para heredar el color del Layout
    <div className="w-full max-w-6xl mx-auto">

      {/* Encabezado con flecha de regreso */}
      <div className="flex items-center gap-4 mb-6 mt-2">
        <Link to="/clientes" className="text-guadalupe-blanco hover:text-guadalupe-amarillo transition">
          <ArrowLeft size={28} />
        </Link>
        <h2 className="text-3xl font-extrabold text-guadalupe-blanco tracking-wide">
          Clientes
        </h2>
      </div>

      {/* Botón de Acción Principal */}
      <div className="mb-8">
        <button className="bg-guadalupe-amarillo text-guadalupe-azul font-bold text-sm px-8 py-2.5 rounded-full shadow-lg uppercase tracking-widest hover:bg-yellow-400 transition">
          Crear Cliente
        </button>
      </div>

      {/* Grid de las dos tarjetas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ======================================= */}
        {/* TARJETA 1: DATOS PERSONALES */}
        {/* ======================================= */}
        <div className="flex flex-col shadow-2xl relative">
          {/* Cabecera Gris */}
          <div className="bg-guadalupe-gris py-3.5 text-center rounded-t-[20px]">
            <h3 className="text-guadalupe-blanco font-extrabold text-[17px] uppercase tracking-widest">
              Datos Personales
            </h3>
          </div>

          {/* Cuerpo Azul */}
          <div className="bg-guadalupe-azul p-8 rounded-b-[20px] text-sm">
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-guadalupe-blanco/80 font-medium">Nombre Completo:</span>
                <span className="text-guadalupe-blanco font-bold">Luis Andres Arias</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-guadalupe-blanco/80 font-medium">Cédula:</span>
                <span className="text-guadalupe-blanco font-bold">1053890890</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-guadalupe-blanco/80 font-medium">Fecha de Vinculación:</span>
                <span className="text-guadalupe-blanco font-bold">27/7/2026</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-guadalupe-blanco/80 font-medium">Dirección de Cobro:</span>
                <span className="text-guadalupe-blanco font-bold uppercase">CALLE 67 # 90-20</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-guadalupe-blanco/80 font-medium">Contacto:</span>
                <span className="text-guadalupe-blanco font-bold">3216789090</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-guadalupe-blanco/80 font-medium">Barrio:</span>
                <span className="text-guadalupe-blanco font-bold">Cumbre</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2.5 pr-[120px]">
                <span className="text-guadalupe-blanco/80 font-medium">Número de Crédito:</span>
                <span className="text-guadalupe-blanco font-bold">3349</span>
              </div>
              <div className="flex justify-between items-center pt-1.5 pr-[120px]">
                <span className="text-guadalupe-blanco/80 font-medium">Ruta:</span>
                <span className="text-guadalupe-blanco font-bold">002</span>
              </div>
            </div>

            {/* Botón flotante dentro de la tarjeta */}
            <div className="absolute bottom-8 right-8">
              <button className="bg-guadalupe-amarillo text-guadalupe-azul font-extrabold text-xs px-6 py-2 rounded-full shadow-lg hover:bg-yellow-400 transition">
                Ver Créditos
              </button>
            </div>
          </div>
        </div>

        {/* ======================================= */}
        {/* TARJETA 2: DATOS DE FIADOR */}
        {/* ======================================= */}
        <div className="flex flex-col shadow-2xl lg:max-w-[480px]">
          {/* Cabecera Gris */}
          <div className="bg-guadalupe-gris py-3.5 text-center rounded-t-[20px]">
            <h3 className="text-guadalupe-blanco font-extrabold text-[17px] uppercase tracking-widest">
              Datos de Fiador
            </h3>
          </div>

          {/* Cuerpo Azul */}
          <div className="bg-guadalupe-azul p-8 rounded-b-[20px] text-sm h-full">
            <div className="space-y-4">
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-guadalupe-blanco/80 font-medium">Cédula:</span>
                <span className="text-guadalupe-blanco font-bold">10538789890</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-guadalupe-blanco/80 font-medium">Nombre Completo:</span>
                <span className="text-guadalupe-blanco font-bold">Felipe morales gómez</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-guadalupe-blanco/80 font-medium">Dirección:</span>
                <span className="text-guadalupe-blanco font-bold">Calle 60 # 90-27</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-guadalupe-blanco/80 font-medium">Barrio:</span>
                <span className="text-guadalupe-blanco font-bold">Sultana</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2.5">
                <span className="text-guadalupe-blanco/80 font-medium">Contacto:</span>
                <span className="text-guadalupe-blanco font-bold">3215678909</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}