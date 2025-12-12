import React from 'react';
// Asegúrate de que la ruta sea correcta a tu componente de mapa
import MapaSelectorCoordenadas from '../MapaSelectorCoordenadas';

const PanelUbicacion = ({ latitud, longitud }) => {
  const lat = Number(latitud);
  const lng = Number(longitud);

  if (!lat || !lng) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100/10 backdrop-blur-sm text-gray-400 text-xs uppercase tracking-widest">
        Sin ubicación
      </div>
    );
  }

  return (
    <div className="h-full w-full pointer-events-none relative z-0">
       <MapaSelectorCoordenadas 
          latitud={lat} 
          longitud={lng} 
          onCoordenadasChange={() => {}} 
       />
    </div>
  );
};

export default PanelUbicacion;