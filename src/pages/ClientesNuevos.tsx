import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function ClientesNuevos() {
  const navigate = useNavigate();

  // 1. Estado del formulario (Mantenemos Manizales por defecto)
  const [formData, setFormData] = useState({
    empresa_id: "6608657b-4a69-408c-a61f-99e1acbfa636",
    ruta_id: "",
    documento_identidad: "",
    nombre_completo: "",
    direccion: "",
    telefono: "",
    barrio: "",
    ciudad: "Manizales",
    correo: "",
    numero_credito: "",
    // Datos Fiador
    fiador_cedula: "",
    fiador_nombre: "",
    fiador_direccion: "",
    fiador_barrio: "",
    fiador_contacto: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://127.0.0.1:8000/clientes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('¡Cliente creado con éxito!');
        // Nos devuelve a la lista de clientes automáticamente
        navigate('/clientes');
      } else {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        alert(`FastAPI rechazó los datos: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error al conectar con FastAPI.');
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto pb-10">

      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-8 mt-2">
        <Link to="/clientes" className="text-guadalupe-blanco hover:text-guadalupe-amarillo transition">
          <ArrowLeft size={28} />
        </Link>
        <h2 className="text-3xl font-extrabold text-guadalupe-blanco tracking-wide">
          Nuevo Cliente
        </h2>
      </div>

      {/* Formulario Principal que envuelve las tarjetas */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* TARJETA 1: DATOS PERSONALES */}
          <div className="flex flex-col shadow-2xl relative">
            <div className="bg-guadalupe-gris py-3.5 text-center rounded-t-[20px]">
              <h3 className="text-guadalupe-blanco font-extrabold text-[17px] uppercase tracking-widest">
                Datos Personales
              </h3>
            </div>

            <div className="bg-guadalupe-azul p-8 rounded-b-[20px] text-sm space-y-4">

              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                <label className="text-guadalupe-blanco/80 font-medium">Nombre Completo:</label>
                <input required name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. Luis Andres Arias" />
              </div>

              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                <label className="text-guadalupe-blanco/80 font-medium">Cédula:</label>
                <input required name="documento_identidad" value={formData.documento_identidad} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. 1053890890" />
              </div>

              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                <label className="text-guadalupe-blanco/80 font-medium">Dirección de Cobro:</label>
                <input required name="direccion" value={formData.direccion} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition uppercase" placeholder="EJ. CALLE 67 # 90-20" />
              </div>

              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                <label className="text-guadalupe-blanco/80 font-medium">Contacto (Celular):</label>
                <input required name="telefono" value={formData.telefono} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. 3216789090" />
              </div>

              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                <label className="text-guadalupe-blanco/80 font-medium">Barrio:</label>
                <input required name="barrio" value={formData.barrio} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. Cumbre" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-guadalupe-blanco/80 font-medium">Número de Crédito:</label>
                  <input name="numero_credito" value={formData.numero_credito} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="3349" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-guadalupe-blanco/80 font-medium">Ruta:</label>
                  <input name="ruta_id" value={formData.ruta_id} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="002" />
                </div>
              </div>
            </div>
          </div>

          {/* TARJETA 2: DATOS DE FIADOR */}
          <div className="flex flex-col shadow-2xl lg:max-w-[480px]">
            <div className="bg-guadalupe-gris py-3.5 text-center rounded-t-[20px]">
              <h3 className="text-guadalupe-blanco font-extrabold text-[17px] uppercase tracking-widest">
                Datos de Fiador
              </h3>
            </div>

            <div className="bg-guadalupe-azul p-8 rounded-b-[20px] text-sm h-full space-y-4">

              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                <label className="text-guadalupe-blanco/80 font-medium">Cédula:</label>
                <input name="fiador_cedula" value={formData.fiador_cedula} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. 10538789890" />
              </div>

              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                <label className="text-guadalupe-blanco/80 font-medium">Nombre Completo:</label>
                <input name="fiador_nombre" value={formData.fiador_nombre} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. Felipe Morales Gómez" />
              </div>

              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                <label className="text-guadalupe-blanco/80 font-medium">Dirección:</label>
                <input name="fiador_direccion" value={formData.fiador_direccion} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. Calle 60 # 90-27" />
              </div>

              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                <label className="text-guadalupe-blanco/80 font-medium">Barrio:</label>
                <input name="fiador_barrio" value={formData.fiador_barrio} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. Sultana" />
              </div>

              <div className="flex flex-col gap-1.5 border-b border-white/5 pb-3">
                <label className="text-guadalupe-blanco/80 font-medium">Contacto (Celular):</label>
                <input name="fiador_contacto" value={formData.fiador_contacto} onChange={handleChange} type="text" className="bg-[#1A2235] text-guadalupe-blanco border border-white/10 rounded px-3 py-2 focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. 3215678909" />
              </div>

            </div>
          </div>

        </div>

        {/* Botón de Acción Principal */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-guadalupe-amarillo text-guadalupe-azul font-bold text-sm px-10 py-3 rounded-full shadow-lg uppercase tracking-widest hover:bg-yellow-400 transition"
          >
            Crear Cliente
          </button>
        </div>
      </form>

    </div>
  );
}