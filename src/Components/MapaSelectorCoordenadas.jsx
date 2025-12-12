import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';

// Este componente interno maneja los eventos de clic en el mapa
function MapEventsHandler({ onCoordenadasChange, position }) {
  const map = useMap();

  // Evento de clic en el mapa
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onCoordenadasChange(lat, lng); 
    },
  });

  React.useEffect(() => {
    if (position[0] !== 0 && position[1] !== 0) {
      map.flyTo(position, 15); 
    }
  }, [position, map]);

  return null;
}

const MapaSelectorCoordenadas = ({ latitud, longitud, onCoordenadasChange }) => {
  const defaultPosition = [-34.6037, -58.3816];
  
  const position = [
    latitud || defaultPosition[0],
    longitud || defaultPosition[1]
  ];

  const markerVisible = latitud && longitud;

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700">
      <MapContainer 
        center={position} 
        zoom={markerVisible ? 15 : 10}
        style={{ height: '100%', width: '100%' }}
        // 👇👇👇 CAMBIO AQUÍ: Desactivamos el control por defecto 👇👇👇
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // La atribución aquí ya no se muestra automáticamente, pero la dejamos por la licencia
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {markerVisible && <Marker position={position}></Marker>}
        
        <MapEventsHandler 
          onCoordenadasChange={onCoordenadasChange} 
          position={position} 
        />
      </MapContainer>
    </div>
  );
};

export default MapaSelectorCoordenadas;