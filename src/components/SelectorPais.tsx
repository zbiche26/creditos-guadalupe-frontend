import { useState } from 'react';

export default function SelectorPais() {
  const [abierto, setAbierto] = useState(false);
  const paisActual = localStorage.getItem('pais_sistema') || 'CO';

  // Cambiamos los emojis por los códigos de imagen de flagcdn
  const paises = [
    { codigo: 'CO', nombre: 'Colombia', img: 'co', moneda: 'COP' },
    { codigo: 'BR', nombre: 'Brasil', img: 'br', moneda: 'BRL' }, // ¡Brasil agregado!
    { codigo: 'MX', nombre: 'México', img: 'mx', moneda: 'MXN' },
    { codigo: 'US', nombre: 'Dólar (USD)', img: 'us', moneda: 'USD' }, 
    { codigo: 'PE', nombre: 'Perú', img: 'pe', moneda: 'PEN' },
    { codigo: 'AR', nombre: 'Argentina', img: 'ar', moneda: 'ARS' }
  ];

  const paisSeleccionado = paises.find(p => p.codigo === paisActual) || paises[0];

  const cambiarPais = (codigo: string) => {
    localStorage.setItem('pais_sistema', codigo);
    window.location.reload(); 
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-2 bg-[#1a2235] hover:bg-[#242e42] border border-gray-700/50 px-3 py-2 rounded-xl transition shadow-sm"
      >
        {/* Aquí mostramos la bandera como imagen real */}
        <img src={`https://flagcdn.com/w20/${paisSeleccionado.img}.png`} alt={paisSeleccionado.nombre} className="w-5 h-auto rounded-sm shadow-sm" />
        <span className="text-white text-xs font-bold">{paisSeleccionado.moneda}</span>
      </button>

      {abierto && (
        <div className="absolute top-full right-0 mt-2 w-44 bg-[#1e2738] border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden z-50">
          {paises.map((pais) => (
            <button
              key={pais.codigo}
              onClick={() => cambiarPais(pais.codigo)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition hover:bg-[#2a354a] ${paisActual === pais.codigo ? 'bg-[#2a354a] font-bold text-white' : 'text-gray-300'}`}
            >
              <img src={`https://flagcdn.com/w20/${pais.img}.png`} alt={pais.nombre} className="w-5 h-auto rounded-sm shadow-sm" />
              {pais.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}