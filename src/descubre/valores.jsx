import { motion } from "framer-motion";

const valoresData = [
  {
    titulo: "Transparencia",
    imagen: "https://slowfashionnext.com/wp-content/uploads/2022/09/pexels-cottonbro-4622416.jpg",
  },
  {
    titulo: "Autenticidad",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhvY5Z2gJEZy3KfoXEkP8IxpmlX3xmDBIANg&s",
  },
  {
    titulo: "Innovación consciente",
    imagen: "https://cdn.shopify.com/s/files/1/0479/4558/0694/files/chio-lecca-blog-moda-sostenible-caracteristicas.jpg?v=1689405709",
  },
  {
    titulo: "Atención al detalle",
    imagen: "https://audaces.com/wp-content/uploads/2023/06/gestao-moda-o-que-e-1024x693.jpg",
  },
  {
    titulo: "Inclusión de cuerpos",
    imagen: "https://www.esan.edu.pe/images/blog/2021/12/15/1500x844-moda-diversidad-2021-15-12.jpg",
  },
  {
    titulo: "Moda emocional",
    imagen: "https://fotos.perfil.com//2024/06/11/900/0/goodlymedia-1817749.jpg",
  },
];

export default function ValoresCarrusel() {
  return (
    <section className="py-20 px-6 bg-gradient-linea-to-b from-white to-pink-50">
      <h2 className="text-center text-4xl font-bold text-pink-500 mb-10 uppercase tracking-wide">
        Nuestros Valores
      </h2>

      <div className="overflow-hidden">
        <motion.div
          className="flex gap-6 cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -800, right: 0 }}
        >
          {valoresData.map((valor, i) => (
            <motion.div
              key={i}
              className="min-w-[250px] bg-white rounded-2xl shadow-lg border border-pink-200 overflow-hidden group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={valor.imagen}
                  alt={valor.titulo}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
              </div>

              <div className="p-4 text-center">
                <p className="text-xl font-semibold text-pink-600">
                  {valor.titulo}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
