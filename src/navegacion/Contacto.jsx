import { useState } from 'react'; // Usamos un hook para el estado del formulario

const Contacto = () => {
  // Estado para manejar los datos del formulario (Mejora funcional)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de contacto enviados:', formData);
    // Aquí iría la lógica para enviar el formulario a un servicio o API
    alert('Mensaje enviado. ¡Gracias por contactarnos!'); 
    setFormData({ nombre: '', email: '', mensaje: '' }); // Limpiar el formulario
  };

  return (
    <div className="max-w-4xl mx-auto p-8 mt-10 bg-white rounded-2xl shadow-3xl">
      <h1 className="text-4xl font-extrabold text-center text-pink-700 mb-8">
        ¿Lista para Brillar? Contáctanos
      </h1>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input 
            type="text" 
            id="nombre" 
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-pink-500 focus:border-pink-500 transition duration-150"
            placeholder="Tu nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input 
            type="email" 
            id="email" 
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-pink-500 focus:border-pink-500 transition duration-150"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">Tu Mensaje (¡Queremos escucharte!)</label>
          <textarea 
            id="mensaje" 
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-pink-500 focus:border-pink-500 transition duration-150"
            placeholder="Preguntas sobre tallas, pedidos o colaboraciones."
            value={formData.mensaje}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-[1.01]"
        >
          Enviar Mensaje ✨
        </button>
      </form>
      
      <div className="mt-10 text-center text-gray-500 space-y-2 border-t pt-6">
        <p>O encuéntranos en:</p>
        <p className="text-lg font-semibold">hola@novaglow.com</p>
      </div>
    </div>
  );
};

export default Contacto;