// Datos de ejemplo que simulan venir de tu backend
export const mockHechos = [
  {
    id: 1,
    titulo: "Colisión en Av. Corrientes y Callao",
    descripcion: "Una colisión múltiple involucrando dos autos y un colectivo. Se reportaron 3 heridos leves. El tránsito está cortado en la zona, se recomienda evitar el área.",
    categoria: "Accidente de Tránsito",
    latitud: -34.604,
    longitud: -58.391,
    fechaAcontecimiento: "2025-10-28T14:30:00",
    fechaCreacion: "2025-10-28T15:05:00",
    ultimaModificacion: "2025-10-28T15:05:00",
    reportadoPor: "admin",
    estado: "Subido", // 'Subido' o 'No visible'
    imagenes: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1974",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1926",
    ]
  },
  {
    id: 2,
    titulo: "Obra de subterráneo en Congreso",
    descripcion: "Ampliación de línea de subte con desvíos de transporte. Las obras durarán 3 meses y afectarán la circulación en Av. Rivadavia.",
    categoria: "Construcción",
    latitud: -34.6097,
    longitud: -58.3925,
    fechaAcontecimiento: "2025-11-18T08:00:00",
    fechaCreacion: "2025-10-27T10:15:00",
    ultimaModificacion: "2025-10-28T09:30:00",
    reportadoPor: "admin",
    estado: "No visible", // 'Subido' o 'No visible'
    imagenes: [
      "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070",
    ]
  },
  {
    id: 3,
    titulo: "Incendio en local de Palermo",
    descripcion: "Fuego en un local gastronómico en la zona de Palermo Soho. Bomberos trabajando en el lugar, no hay heridos.",
    categoria: "Incendio",
    latitud: -34.5889,
    longitud: -58.427,
    fechaAcontecimiento: "2025-10-26T22:45:00",
    fechaCreacion: "2025-10-26T23:00:00",
    ultimaModificacion: "2025-10-27T08:20:00",
    reportadoPor: "admin",
    estado: "Subido",
    imagenes: [
      "https://images.unsplash.com/photo-1603400501332-ce00366b3f7a?q=80&w=1974",
      "https://images.unsplash.com/photo-1561619463-149013b0e353?q=80&w=2070",
      "https://images.unsplash.com/photo-1599839958334-73e48e00e008?q=80&w=2070",
    ]
  },
];