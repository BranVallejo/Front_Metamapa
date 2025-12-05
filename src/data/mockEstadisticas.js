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
  { hora: 0, cantidadHechos: 10, categoriaNombre: "Robo" },
  { hora: 4, cantidadHechos: 5, categoriaNombre: "Robo" },
  { hora: 8, cantidadHechos: 45, categoriaNombre: "Robo" },
  { hora: 12, cantidadHechos: 30, categoriaNombre: "Robo" },
  { hora: 16, cantidadHechos: 60, categoriaNombre: "Robo" },
  { hora: 20, cantidadHechos: 100, categoriaNombre: "Robo" },
];

// Simula: EstadCantidadSolicitudesSpamDTO
export const mockSpam = [
  { fechaCalculo: "2025-10-01", cantidadSpam: 15 },
  { fechaCalculo: "2025-10-02", cantidadSpam: 22 },
  { fechaCalculo: "2025-10-03", cantidadSpam: 8 },
];