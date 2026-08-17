import { useState } from 'react';
import { X } from 'lucide-react';

export default function CrearClientModal({ onClose }: { onClose: () => void }) {
  // 1. Estado ajustado EXACTAMENTE al esquema de tu FastAPI
  const [formData, setFormData] = useState({
    empresa_id: "1", // Valor por defecto (cámbialo si tu lógica lo requiere)
    ruta_id: "",
    documento_identidad: "",
    nombre_completo: "",
    direccion: "",
    telefono: "",
    barrio: "",
    ciudad: "Manizales", // Por defecto
    correo: "", // Por defecto vacío
    numero_credito: "",
    // Datos Fiador
    fiador_cedula: "",
    fiador_nombre: "",
    fiador_direccion: "",
    fiador_barrio: "",
    fiador_contacto: ""
  });

  // 2. Función genérica para manejar los cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // 3. Función para enviar los datos a FastAPI
  // 3. Función para enviar los datos a FastAPI (AHORA CON SEGURIDAD)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Buscamos la llave secreta que guardaste al iniciar sesión
      // (Si en tu Login le pusiste otro nombre como 'access_token', cámbialo aquí)
      const token = localStorage.getItem('token');

      const response = await fetch('http://127.0.0.1:8000/clientes/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 2. Le mostramos el carnet al backend usando la cabecera Authorization
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('¡Cliente creado con éxito en la base de datos!');
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Error del servidor:', errorData);
        alert(`Hubo un error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('No se pudo conectar con el servidor backend (FastAPI).');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A2235] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">

        <div className="flex justify-between items-center bg-guadalupe-azul p-6 rounded-t-2xl border-b border-white/5 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-guadalupe-amarillo uppercase tracking-widest">
            Crear Nuevo Cliente
          </h2>
          <button onClick={onClose} className="text-guadalupe-blanco/60 hover:text-[#ef4444] transition-colors p-1">
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>

            {/* --- SECCIÓN DATOS PERSONALES --- */}
            <div>
              <h3 className="text-sm font-bold text-guadalupe-gris uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                Datos Personales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">Nombre Completo</label>
                  {/* Se ajustó el name="nombre_completo" */}
                  <input required name="nombre_completo" value={formData.nombre_completo} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. Luis Andres Arias" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">Cédula</label>
                  {/* Se ajustó el name="documento_identidad" */}
                  <input required name="documento_identidad" value={formData.documento_identidad} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. 1053890890" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">Dirección de Cobro</label>
                  {/* Se ajustó el name="direccion" */}
                  <input required name="direccion" value={formData.direccion} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. Calle 67 # 90-20" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">Barrio</label>
                  <input required name="barrio" value={formData.barrio} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. Cumbre" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">Contacto (Celular)</label>
                  {/* Se ajustó el name="telefono" */}
                  <input required name="telefono" value={formData.telefono} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. 3216789090" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">N° Crédito</label>
                    <input name="numero_credito" value={formData.numero_credito} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="3349" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">Ruta</label>
                    {/* Se ajustó el name="ruta_id" */}
                    <input name="ruta_id" value={formData.ruta_id} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="002" />
                  </div>
                </div>
              </div>
            </div>

            {/* --- SECCIÓN DATOS DEL FIADOR --- */}
            <div>
              <h3 className="text-sm font-bold text-guadalupe-gris uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                Datos del Fiador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">Nombre Completo</label>
                  <input name="fiador_nombre" value={formData.fiador_nombre} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. Felipe Morales Gómez" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">Cédula</label>
                  <input name="fiador_cedula" value={formData.fiador_cedula} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. 10538789890" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">Dirección</label>
                  <input name="fiador_direccion" value={formData.fiador_direccion} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. Calle 60 # 90-27" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">Barrio</label>
                  <input name="fiador_barrio" value={formData.fiador_barrio} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. Sultana" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-guadalupe-blanco/70 mb-1.5">Contacto (Celular)</label>
                  <input name="fiador_contacto" value={formData.fiador_contacto} onChange={handleChange} type="text" className="w-full bg-[#242E42] border border-white/5 rounded-lg px-4 py-2.5 text-guadalupe-blanco focus:outline-none focus:border-guadalupe-amarillo transition" placeholder="Ej. 3215678909" />
                </div>
              </div>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex justify-end gap-4 pt-6 border-t border-white/5 mt-4">
              <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-sm font-bold text-guadalupe-blanco/70 hover:bg-white/5 transition">
                Cancelar
              </button>
              <button type="submit" className="px-8 py-2.5 rounded-full text-sm font-extrabold bg-guadalupe-amarillo text-guadalupe-azul shadow-lg hover:bg-yellow-400 transition">
                Guardar Cliente
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}