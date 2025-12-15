import { Zap, Heart, Sparkles, Feather, Sun, Eye, Star, Aperture, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const CategoryPromoCard = ({ title, icon: Icon, color, link, description, imageUrl }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="group relative h-80 rounded-4xl overflow-hidden cursor-pointer"
  >
    <div className="absolute inset-0 bg-gray-200">
        <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
            onError={(e) => (e.target.src = "https://placehold.co/600x800/pink/white?text=Glow")}
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
    </div>
    
    <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
        <div className={`w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 text-${color}-300`}>
             <Icon size={24} className="text-white" />
        </div>
        <h3 className="text-3xl font-black mb-2">{title}</h3>
        <p className="text-white/80 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            {description}
        </p>
        <Link to={link} className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-widest hover:underline decoration-pink-400">
            Ver Ahora <ArrowRight size={16} />
        </Link>
    </div>
  </motion.div>
);

const Principio = ({ title, icon, description, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: delay * 0.2 }}
    className="p-8 bg-white/60 backdrop-blur-xl rounded-4xl border border-white/50 shadow-xl shadow-pink-100/50 hover:shadow-pink-200/50 transition-all duration-300"
  >
    <div className="w-16 h-16 bg-linear-to-br from-pink-100 to-rose-50 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner">
      {icon === "✨" ? <Sparkles className="text-pink-500" /> : icon === "📏" ? <Zap className="text-purple-500" /> : <Heart className="text-rose-500" />}
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-500 leading-relaxed">{description}</p>
  </motion.div>
);

const TeamMember = ({ name, role, tagline, imageUrl, index }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="group relative"
  >
    <div className="relative overflow-hidden rounded-4xl aspect-3/4 mb-4">
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
        <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
            onError={(e) => (e.target.src = "https://placehold.co/400x500/pink/white?text=NovaTeam")}
        />
        <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <p className="text-white text-xs italic">"{tagline}"</p>
        </div>
    </div>
    <div className="text-center">
        <h3 className="text-xl font-black text-gray-900">{name}</h3>
        <p className="text-pink-500 font-bold text-xs uppercase tracking-widest">{role}</p>
    </div>
  </motion.div>
);

// --- COMPONENTE PRINCIPAL ---

export default function Nosotros() {
  return (
    <div className="bg-[#FDFBFD] text-gray-800 font-sans selection:bg-pink-200 selection:text-pink-900 overflow-x-hidden">
      
      {/* Fondo Decorativo (Noise & Blobs) */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
         <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-pink-300/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
         <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-rose-300/20 rounded-full blur-[100px] mix-blend-multiply"></div>
      </div>

      <div className="relative z-10">
          
          {/* 1. HERO SECTION: Massive & Bold */}
          <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-20 pb-10">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                  <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur border border-pink-200 px-4 py-1.5 rounded-full mb-6">
                      <Aperture className="w-4 h-4 text-pink-500 animate-spin-slow" /> 
                      <span className="text-xs font-bold text-pink-600 uppercase tracking-widest">Est. 2025</span>
                  </div>
                  
                  <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-6">
                      EL VIAJE <br/>
                      <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-rose-600 italic font-serif pr-2">NOVA GLOW</span>
                  </h1>

                  <p className="text-xl md:text-2xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
                      Donde la alta costura se encuentra con la <span className="font-bold text-gray-800">confianza radical</span>. 
                      No solo vendemos vestidos, diseñamos momentos.
                  </p>
              </motion.div>
          </section>

          {/* 2. STORY SECTION: Editorial Layout */}
          <section className="max-w-7xl mx-auto px-6 py-20">
              <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
                  <div className="grid md:grid-cols-2 gap-16 items-center">
                      <div className="relative z-10">
                          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                              La Noche en que <br/>
                              <span className="text-pink-500">Todo Comenzó.</span>
                          </h2>
                          <div className="space-y-6 text-lg text-gray-600">
                              <p>
                                  Nova Glow nació de una epifanía simple: la ropa de noche solía ser incómoda o aburrida. 
                                  Nosotras queríamos <strong className="text-gray-900">fuego</strong>.
                              </p>
                              <p>
                                  No buscábamos solo tela y lentejuelas, sino prendas que encendieran un interruptor interno. 
                                  Creemos firmemente que cada mujer merece ser la protagonista de su propia película.
                              </p>
                          </div>
                      </div>
                      
                      {/* Imagen con efecto de rotación */}
                      <div className="relative">
                          <div className="absolute inset-0 bg-pink-200 rounded-4xl transform rotate-6 scale-95"></div>
                          <img 
                              src="https://lacosmeticadeelyn.com/wp-content/uploads/2023/03/comprar-vestidos-de-fiesta.jpg" 
                              alt="Historia Nova Glow"
                              className="relative rounded-4xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-700 w-full object-cover aspect-4/3"
                          />
                      </div>
                  </div>
              </div>
          </section>

          {/* 3. PILLARES: Glass Cards */}
          <section className="max-w-7xl mx-auto px-6 py-20">
              <div className="text-center mb-16">
                  <span className="text-pink-500 font-bold tracking-widest text-sm uppercase">Nuestro ADN</span>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-2">Los 3 Pilares del Brillo</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Principio 
                      title="Brillo Sostenible" 
                      icon="✨" 
                      description="Glamour sin culpa. Priorizamos materiales responsables y procesos éticos."
                      delay={1}
                  />
                  <Principio 
                      title="Ajuste Perfecto" 
                      icon="📏" 
                      description="Pruebas rigurosas. Diseñamos para cuerpos reales, asegurando confort toda la noche."
                      delay={2}
                  />
                  <Principio 
                      title="Actitud Pura" 
                      icon="❤️" 
                      description="Vendemos protagonismo. Al ponerte Nova Glow, la confianza se activa al instante."
                      delay={3}
                  />
              </div>
          </section>

          {/* 4. TEAM: Grid Moderno */}
          <section className="py-24 bg-white relative overflow-hidden">
             {/* Elemento decorativo */}
             <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,228,230,0.5),transparent_70%)]"></div>
             
             <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <h2 className="text-5xl md:text-6xl font-black text-gray-900 leading-none">
                        Mentes <br/> <span className="text-transparent text-outline-pink stroke-pink-500" style={{WebkitTextStroke: "1px #ec4899", color:"transparent"}}>Maestras</span>
                    </h2>
                    <p className="max-w-md text-gray-500 text-lg">
                        Un equipo de soñadoras, diseñadoras y rebeldes unidas por una obsesión: tu brillo.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
                    <TeamMember 
                        name="Valentina C." role="Fundadora & CEO" 
                        tagline="Mi pieza favorita para brillar es un buen top de satín." 
                        imageUrl="https://images.imagenmia.com/model_version/1df843cb6790d0651e956078c93e0f37a1535300950019cc576ef7b8cc5d62a5/1723977778333-output.jpg"
                        index={1}
                    />
                    <TeamMember 
                        name="Shantall C." role="Marketing Dir." 
                        tagline="La confianza es el mejor accesorio." 
                        imageUrl="https://img.freepik.com/fotos-premium/imagen-mujer-entregando-paquete-fondo-impactante-diseno-limpio-sonrisa-feliz-fondo-pastel_934697-178.jpg"
                        index={2}
                    />
                    <TeamMember 
                        name="Camila C." role="Head of Design" 
                        tagline="Inspirada por la luz de la ciudad a medianoche." 
                        imageUrl="https://images.pexels.com/photos/19279369/pexels-photo-19279369.jpeg?cs=srgb&dl=pexels-s%C6%A1n-ng%E1%BB%8Dc-19279369.jpg&fm=jpg"
                        index={3}
                    />
                    <TeamMember 
                        name="Hylary R." role="Producción" 
                        tagline="Cada detalle cuenta para crear magia." 
                        imageUrl="https://img.freepik.com/fotos-premium/retrato-mujer-hermosa-sonriente-feliz_176420-15309.jpg"
                        index={4}
                    />
                </div>
             </div>
          </section>

          {/* 5. MISION & VISION: Bento Grid Style */}
          <section className="max-w-7xl mx-auto px-6 py-24">
              <div className="grid md:grid-cols-2 gap-8">
                  {/* Card Misión */}
                  <div className="bg-rose-50 rounded-[2.5rem] p-10 flex flex-col justify-between min-h-[400px] group hover:bg-rose-100 transition-colors">
                      <div>
                          <div className="flex items-center gap-3 mb-6">
                              <div className="p-3 bg-white rounded-full shadow-sm"><Heart className="text-rose-500" /></div>
                              <h3 className="text-2xl font-bold">Nuestra Misión</h3>
                          </div>
                          <p className="text-xl text-gray-700 font-medium leading-relaxed">
                              "Empoderar a través de la moda. No vestimos cuerpos, vestimos actitudes. En Nova Glow, tú eres la estrella."
                          </p>
                      </div>
                      <div className="mt-8 rounded-3xl overflow-hidden h-48 w-full">
                          <img src="https://e00-telva.uecdn.es/assets/multimedia/imagenes/2022/10/06/16650606858239.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                      </div>
                  </div>

                  {/* Card Visión */}
                  <div className="bg-gray-900 rounded-[2.5rem] p-10 flex flex-col justify-between min-h-[400px] text-white group relative overflow-hidden">
                       {/* Abstract BG */}
                       <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                       
                       <div>
                          <div className="flex items-center gap-3 mb-6">
                              <div className="p-3 bg-white/10 backdrop-blur rounded-full"><Eye className="text-pink-300" /></div>
                              <h3 className="text-2xl font-bold">Nuestra Visión</h3>
                          </div>
                          <p className="text-xl text-gray-300 font-medium leading-relaxed">
                              "Un mundo donde cada noche es una oportunidad para brillar. Lujo accesible, sostenible y deslumbrante."
                          </p>
                       </div>
                       <div className="mt-8 rounded-3xl overflow-hidden h-48 w-full border border-white/10">
                          <img src="https://www.clara.es/medio/2023/05/31/10-outfits-para-una-cena-informal-en-verano_c69e2aad_230531103813_1080x1349.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"/>
                      </div>
                  </div>
              </div>
          </section>

          {/* 6. BLOG PROMO */}
          <section className="py-20 px-6">
              <div className="max-w-6xl mx-auto">
                  <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                      <div>
                          <h2 className="text-4xl font-black text-gray-900">Inspiración <span className="italic font-serif text-pink-500">&</span> Estilo</h2>
                          <p className="text-gray-500 mt-2">Guías, tendencias y secretos para potenciar tu look.</p>
                      </div>
                      <Link to="/inspiracion" className="mt-4 md:mt-0 px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-pink-600 transition-colors shadow-lg">
                          Explorar Blog
                      </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <CategoryPromoCard
                          title="Tendencias"
                          icon={Sun} color="pink"
                          link="/inspiracion?tema=Tendencias"
                          imageUrl="http://www.tiendaunique.cl/cdn/shop/products/4244navy_2_e1173c6b-d1c1-48ad-8c5e-678abe5fdba2.jpg?v=1658170307&width=1024"
                          description="Lo último en la moda nocturna global."
                      />
                      <CategoryPromoCard
                          title="Guías"
                          icon={Feather} color="violet"
                          link="/inspiracion?tema=Guia"
                          imageUrl="https://www.mujerde10.com/wp-content/uploads/2025/06/moda-outfits-de-noche-antro-juvenil-con-transparencias-5-1024x678.jpg"
                          description="Arma el outfit perfecto para cada evento."
                      />
                      <CategoryPromoCard
                          title="Inspiración"
                          icon={Star} color="yellow"
                          link="/inspiracion?tema=Inspiracion"
                          imageUrl="https://i.pinimg.com/564x/c5/53/a6/c553a67d99cb5d833d6828808e5e9ac4.jpg"
                          description="El poder del brillo interior."
                      />
                  </div>
              </div>
          </section>

      </div>
    </div>
  );
}