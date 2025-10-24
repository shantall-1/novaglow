
import {  Sun, Feather, Star } from 'lucide-react';



export const allArticles = [
    { 
        id: 1, 
        slug: "colores-temporada-fiestas", 
        title: "Los 5 Colores de la Temporada de Fiestas", 
        category: "Tendencias", 
        date: "20/10/2025", 
        readTime: "4 min",
        icon: Sun, color: "pink", 
        description: "Descubre la paleta que dominará los eventos nocturnos este año.", 
        imageUrl: "https://i.ytimg.com/vi/5u6rpfIuvqM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDQey7PPQRZo_DcQ_w205Awq8N1yA",
        content: [
            { type: 'paragraph', text: "La moda nocturna se renueva, y esta temporada, la paleta se concentra en tonos audaces y metálicos. Hemos identificado cinco colores esenciales que no pueden faltar en tu vestuario para eventos." },
            { type: 'heading', text: "1. El Rojo Carmesí" },
            { type: 'paragraph', text: "Clásico e infalible. El Rojo Carmesí se mantiene como el rey de la noche, simbolizando pasión y poder. Es perfecto para vestidos largos o jumpsuits sofisticados." },
            { type: 'heading', text: "2. El Azul Eléctrico" },
            { type: 'paragraph', text: "Para quienes buscan deslumbrar. El Azul Eléctrico regresa con fuerza, especialmente en telas con brillo o lentejuelas. Combínalo con accesorios plateados para un look futurista." },
            { type: 'heading', text: "3. Dorado Rosa Suave" },
            { type: 'paragraph', text: "Una alternativa elegante al dorado tradicional. El Dorado Rosa ofrece un brillo cálido y sutil, ideal para bodas de noche y galas formales." },
            { type: 'paragraph', text: "Recuerda que la clave es la confianza. Llevar estos colores con seguridad es el mejor accesorio. ¡Brilla con Nova Glow!" },
        ],
    },
    { 
        id: 2, 
        slug: "guia-rapida-vestidos-coctel", 
        title: "Guía Rápida para Vestidos de Cóctel", 
        category: "Guía de Estilo", 
        date: "15/09/2025", 
        readTime: "3 min",
        icon: Feather, color: "violet",
        description: "Todo lo que necesitas saber sobre la etiqueta y el largo adecuado.", 
        imageUrl: "https://cdn0.matrimonios.cl/article-vendor/8149/original/960/jpeg/127035b9-52a6-43dc-b59c-93bb02225ffb_8_108149-158256214183165.webp",
        content: [
            { type: 'paragraph', text: "El vestido de cóctel es el punto medio perfecto entre lo casual y lo formal. Aquí te damos las reglas de oro para acertar siempre con el largo y el estilo." },
            { type: 'list', items: ["Largo: Debe ir por encima de la rodilla, a media pierna, o justo debajo (estilo 'tea-length'). Evita los largos hasta el suelo.", "Accesorios: Opta por carteras de mano (clutch) pequeñas y zapatos elegantes de tacón.", "Tejidos: Elige telas ricos como seda, encaje o terciopelo. Evita el algodón o lino."], },
            { type: 'paragraph', text: "Un buen vestido de cóctel siempre debe hacerte sentir cómoda y fabulosa. No subestimes el poder de un ajuste perfecto." }
        ],
    },
    { 
        id: 3, 
        slug: "vestidos-fiesta-sostenibles", 
        title: "¿Cómo Elegir Vestidos de Fiesta Sostenibles?", 
        category: "Inspiración", 
        date: "05/11/2025", 
        readTime: "5 min",
        icon: Star, color: "green",
        description: "Un vistazo a la moda ética y brillante para eventos especiales.", 
        imageUrl: "https://cdn0.matrimonios.cl/article/3099/3_2/1280/png/59903-portada-2022-12-16t142854-113.jpeg",
        content: [
            { type: 'paragraph', text: "La sostenibilidad ha llegado a la moda de fiesta. Ya no tienes que sacrificar el glamour por ser consciente del medio ambiente." },
            { type: 'heading', text: "Telas a Priorizar" },
            { type: 'list', items: ["Seda orgánica o Tencel (lyocell): Alternativas lujosas con menor impacto hídrico.", "Poliéster reciclado: Ideal para lentejuelas y brillos, minimizando nuevos plásticos."], },
            { type: 'paragraph', text: "Considera también la longevidad. Un vestido de alta calidad que puedes usar en múltiples eventos es la opción más sostenible de todas. ¡Nova Glow te ayuda a tomar decisiones brillantes y responsables!" },
        ],
    },
];
