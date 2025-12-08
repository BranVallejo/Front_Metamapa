// Simula: EstadMayorHechosPorProvinciaColeccionDTO

export const mockRankingProvincias = [
  { 
    coleccionTitulo: "Incendios Verano", 
    provincia: "Córdoba", 
    cantidadHechos: 120, 
    fechaCalculo: "2025-10-30" 
  },
  { 
    coleccionTitulo: "Inundaciones PBA", 
    provincia: "Buenos Aires", 
    cantidadHechos: 85,
    fechaCalculo: "2025-10-30" 
  },
  { 
    coleccionTitulo: "Sismos Cuyo", 
    provincia: "San Juan", 
    cantidadHechos: 45,
    fechaCalculo: "2025-10-30" 
  },
  { 
    coleccionTitulo: "Accidentes Ruta 2", 
    provincia: "Buenos Aires", 
    cantidadHechos: 150,
    fechaCalculo: "2025-10-30" 
  },
];


// Simula: EstadCategoriaMasReportadaDTO
export const mockCategoriaMasReportada = [
  { categoriaNombre: "Inundación", cantidadHechos: 320 },
  { categoriaNombre: "Incendio", cantidadHechos: 210 },
  { categoriaNombre: "Accidente", cantidadHechos: 150 },
  { categoriaNombre: "Robo", cantidadHechos: 80 },
];

// Simula: EstadHoraPorCategoriaDTO

export const mockHoraPorCategoria = [
  // Datos para ROBO
  { hora: 0, cantidadHechos: 10, categoriaNombre: "Robo" },
  { hora: 4, cantidadHechos: 5, categoriaNombre: "Robo" },
  { hora: 8, cantidadHechos: 45, categoriaNombre: "Robo" },
  { hora: 12, cantidadHechos: 30, categoriaNombre: "Robo" },
  { hora: 16, cantidadHechos: 60, categoriaNombre: "Robo" },
  { hora: 20, cantidadHechos: 100, categoriaNombre: "Robo" },
  
  // Datos para INCENDIO (Pico a la tarde)
  { hora: 10, cantidadHechos: 2, categoriaNombre: "Incendio" },
  { hora: 14, cantidadHechos: 8, categoriaNombre: "Incendio" },
  { hora: 15, cantidadHechos: 9, categoriaNombre: "Incendio" },
  { hora: 18, cantidadHechos: 2, categoriaNombre: "Incendio" },

  // Datos para INUNDACIÓN (Constante)
  { hora: 2, cantidadHechos: 40, categoriaNombre: "Inundación" },
  { hora: 6, cantidadHechos: 45, categoriaNombre: "Inundación" },
  { hora: 10, cantidadHechos: 50, categoriaNombre: "Inundación" },
];

// Simula: EstadCantidadSolicitudesSpamDTO
export const mockSpam = [
  { fechaCalculo: "2025-10-01", cantidadSpam: 15 },
  { fechaCalculo: "2025-10-02", cantidadSpam: 22 },
  { fechaCalculo: "2025-10-03", cantidadSpam: 8 },
];

// src/data/mockEstadisticas.js

export const mockProvinciaPorCategoria = [
  { categoriaNombre: "Incendio", provincia: "Córdoba", cantidadHechos: 120, fechaCalculo: "2025-11-05" },
  { categoriaNombre: "Robo", provincia: "Buenos Aires", cantidadHechos: 350, fechaCalculo: "2025-11-05" },
  { categoriaNombre: "Inundación", provincia: "Santa Fe", cantidadHechos: 95, fechaCalculo: "2025-11-05" },
  { categoriaNombre: "Sismo", provincia: "San Juan", cantidadHechos: 40, fechaCalculo: "2025-11-05" },
  { categoriaNombre: "Nevada", provincia: "Neuquén", cantidadHechos: 25, fechaCalculo: "2025-11-05" },
  { categoriaNombre: "Viento Fuerte", provincia: "Chubut", cantidadHechos: 60, fechaCalculo: "2025-11-05" },
];