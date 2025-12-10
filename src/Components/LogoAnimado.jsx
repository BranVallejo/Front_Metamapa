import React from "react";

const LogoAnimado = () => {
  return (
    // Contenedor principal con 'perspective' para activar el 3D y 'group' para el hover
    <div className="relative w-10 h-10 flex items-center justify-center [perspective:1000px] group cursor-pointer">
      
      {/* 1. LA BASE DEL MAPA (El cuadrado que se inclina) */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 
                   border-2 border-blue-500/40 rounded-xl
                   transform transition-all duration-500 ease-out origin-bottom
                   group-hover:[transform:rotateX(35deg)_scale(0.9)] 
                   group-hover:border-blue-400/80 overflow-hidden"
      >
        {/* Líneas decorativas tipo mapa dentro de la base */}
        <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 10H40M10 0V40M30 0V40M0 30H40" stroke="currentColor" className="text-blue-300"/>
            </svg>
        </div>
      </div>

      {/* 2. EL PIN / MARCADOR QUE SALTA */}
      {/* Usamos un delay sutil y una transición tipo 'spring' (ease-out back) */}
      <div className="absolute z-20 transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] 
                      translate-y-0 group-hover:-translate-y-4 group-hover:scale-110">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          // El drop-shadow hace que parezca que flota de verdad
          className="w-8 h-8 text-blue-500 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)] group-hover:drop-shadow-[0_15px_15px_rgba(59,130,246,0.6)] transition-all"
        >
          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </div>

      {/* 3. EL "GLOW" / SOMBRA DE LUZ EN EL SUELO AL SALTAR */}
      <div className="absolute -bottom-4 w-8 h-3 bg-blue-500/50 blur-xl rounded-full 
                      opacity-0 scale-x-50 transition-all duration-500
                      group-hover:opacity-100 group-hover:scale-x-150"></div>
    </div>
  );
};

export default LogoAnimado;