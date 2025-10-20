const productosData = [
  {
    id: 1,
    name: "Vestido Floral",
    brand: "Bloom Essence",
    price: 59.99,
    discount: 15,
    category: "Ropa",
    subcategory: "Vestidos",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rosa pastel", "Celeste", "Blanco"],
    material: "Algodón y poliéster",
    stock: 34,
    rating: 4.7,
    reviews: 128,
    tags: ["verano", "floral", "casual", "femenino"],
    description1:
      "Vestido fresco con estampado floral y tiras ajustables, ideal para días de verano.",
    description2:
      "Vestido fresco ideal para el verano, corte en A con estampado floral, tiras finas ajustables y forro interior suave. Perfecto para salidas casuales o eventos diurnos.",
    care:
      "Lavar a máquina con agua fría, no usar blanqueador, planchar a baja temperatura.",
    image: "https://via.placeholder.com/300x400.png?text=Vestido+Floral",
    gallery: [
      "https://via.placeholder.com/300x400.png?text=Vestido+Floral+1",
      "https://via.placeholder.com/300x400.png?text=Vestido+Floral+2",
      "https://via.placeholder.com/300x400.png?text=Vestido+Floral+3"
    ]
  },
  {
    id: 2,
    name: "Bolso de Cuero Clásico",
    brand: "Urban Chic",
    price: 89.99,
    discount: 10,
    category: "Accesorios",
    subcategory: "Bolsos",
    colors: ["Marrón oscuro", "Negro", "Beige"],
    material: "Cuero genuino",
    stock: 22,
    rating: 4.8,
    reviews: 93,
    tags: ["elegante", "urbano", "premium", "diario"],
    description1:
      "Bolso de cuero genuino con detalles dorados y amplio espacio interior.",
    description2:
      "Bolso de cuero genuino con detalles metálicos dorados, cierre magnético y compartimentos internos amplios. Ideal para uso diario o salidas elegantes.",
    care: "Limpiar con paño húmedo, evitar exposición prolongada al sol.",
    image: "https://via.placeholder.com/300x400.png?text=Bolso+de+Cuero",
    gallery: [
      "https://via.placeholder.com/300x400.png?text=Bolso+1",
      "https://via.placeholder.com/300x400.png?text=Bolso+2"
    ]
  },
  {
    id: 3,
    name: "Paleta de Maquillaje Glam",
    brand: "Luxe Beauty",
    price: 45.5,
    discount: 5,
    category: "Maquillaje",
    subcategory: "Paletas de sombras",
    tones: ["Cálidos", "Brillantes", "Metálicos"],
    stock: 47,
    rating: 4.6,
    reviews: 175,
    tags: ["glam", "maquillaje", "profesional", "beauty"],
    description1:
      "Paleta de sombras con tonos cálidos y metálicos para un look glamuroso.",
    description2:
      "Paleta con tonos cálidos y pigmentados para un look glamuroso. Incluye 12 sombras en acabados mate, shimmer y metálico. Ideal para todo tipo de piel.",
    ingredients:
      "Mica, talco, dimeticona, pigmentos minerales. Libre de crueldad animal.",
    image: "https://via.placeholder.com/300x400.png?text=Paleta+Glam",
    gallery: [
      "https://via.placeholder.com/300x400.png?text=Paleta+1",
      "https://via.placeholder.com/300x400.png?text=Paleta+2",
      "https://via.placeholder.com/300x400.png?text=Paleta+3"
    ]
  },
  {
    id: 4,
    name: "Zapatillas Blancas Urbanas",
    brand: "StreetMove",
    price: 69.99,
    discount: 20,
    category: "Calzado",
    subcategory: "Zapatillas",
    sizes: [36, 37, 38, 39, 40, 41],
    colors: ["Blanco", "Negro con blanco"],
    material: "Cuero sintético y goma",
    stock: 58,
    rating: 4.5,
    reviews: 210,
    tags: ["urbano", "moderno", "cómodo", "unisex"],
    description1:
      "Zapatillas blancas con suela antideslizante y diseño minimalista.",
    description2:
      "Zapatillas urbanas blancas con diseño minimalista, suela de goma antideslizante y plantilla acolchada para máxima comodidad. Perfectas para el día a día o paseos casuales.",
    care: "Limpiar con paño húmedo, no sumergir en agua.",
    image: "https://via.placeholder.com/300x400.png?text=Zapatillas+Blancas",
    gallery: [
      "https://via.placeholder.com/300x400.png?text=Zapatillas+1",
      "https://via.placeholder.com/300x400.png?text=Zapatillas+2"
    ]
  },
  {
    id: 5,
    name: "Chaqueta de Jean Oversize",
    brand: "DenimArt",
    price: 79.99,
    discount: 25,
    category: "Ropa",
    subcategory: "Chaquetas",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Azul claro", "Azul oscuro"],
    material: "Jean 100% algodón",
    stock: 41,
    rating: 4.9,
    reviews: 185,
    tags: ["casual", "moderno", "unisex", "denim"],
    description1:
      "Chaqueta de jean oversize, estilo moderno y versátil para todo el año.",
    description2:
      "Chaqueta de jean oversize con bolsillos frontales y costuras reforzadas. Su corte relajado la hace ideal para combinar con prendas básicas y crear un look casual o urbano.",
    care:
      "Lavar con agua fría y colores similares, no usar secadora, planchar a temperatura media.",
    image: "https://via.placeholder.com/300x400.png?text=Chaqueta+Jean",
    gallery: [
      "https://via.placeholder.com/300x400.png?text=Chaqueta+1",
      "https://via.placeholder.com/300x400.png?text=Chaqueta+2",
      "https://via.placeholder.com/300x400.png?text=Chaqueta+3"
    ]
  },
  {
    id: 6,
    name: "Reloj Elegance Dorado",
    brand: "TimeLuxe",
    price: 120.0,
    discount: 15,
    category: "Accesorios",
    subcategory: "Relojes",
    colors: ["Dorado", "Plateado"],
    material: "Acero inoxidable",
    stock: 17,
    rating: 4.8,
    reviews: 132,
    tags: ["lujo", "elegante", "moda", "clásico"],
    description1:
      "Reloj dorado de acero inoxidable con diseño clásico y correa ajustable.",
    description2:
      "Reloj de acero inoxidable con acabado dorado, esfera minimalista y correa ajustable. Resistente al agua y diseñado para complementar un look sofisticado o de oficina.",
    care:
      "Limpiar con paño suave, evitar contacto con productos químicos o perfumes.",
    image: "https://via.placeholder.com/300x400.png?text=Reloj+Dorado",
    gallery: [
      "https://via.placeholder.com/300x400.png?text=Reloj+1",
      "https://via.placeholder.com/300x400.png?text=Reloj+2"
    ]
  },
  {
    id: 7,
    name: "Perfume Aurora 100ml",
    brand: "Essence & Co.",
    price: 65.0,
    discount: 10,
    category: "Fragancias",
    subcategory: "Perfumes",
    tones: ["Floral", "Frutal", "Dulce"],
    stock: 25,
    rating: 4.7,
    reviews: 99,
    tags: ["perfume", "femenino", "fragancia", "elegante"],
    description1:
      "Fragancia floral y frutal con notas dulces que evocan frescura y elegancia.",
    description2:
      "Perfume con notas de jazmín, vainilla y frutos rojos. Su aroma envolvente combina feminidad y frescura, ideal para uso diario o noches especiales.",
    care: "Mantener alejado del calor y la luz directa del sol.",
    image: "https://via.placeholder.com/300x400.png?text=Perfume+Aurora",
    gallery: [
      "https://via.placeholder.com/300x400.png?text=Perfume+1",
      "https://via.placeholder.com/300x400.png?text=Perfume+2"
    ]
  },
  {
    id: 8,
    name: "Sombrero de Paja Natural",
    brand: "EcoWear",
    price: 39.99,
    discount: 5,
    category: "Accesorios",
    subcategory: "Sombreros",
    colors: ["Natural", "Beige con cinta negra"],
    material: "Paja trenzada ecológica",
    stock: 60,
    rating: 4.5,
    reviews: 76,
    tags: ["verano", "ecológico", "casual", "playa"],
    description1:
      "Sombrero de paja natural con cinta decorativa, ideal para días soleados.",
    description2:
      "Sombrero de paja ecológica con ala ancha y cinta decorativa negra. Perfecto para protegerte del sol con estilo durante paseos o días de playa.",
    care: "No lavar, limpiar con cepillo seco o paño húmedo.",
    image: "https://via.placeholder.com/300x400.png?text=Sombrero+Paja",
    gallery: [
      "https://via.placeholder.com/300x400.png?text=Sombrero+1",
      "https://via.placeholder.com/300x400.png?text=Sombrero+2"
    ]
  }
];

export { productosData };
