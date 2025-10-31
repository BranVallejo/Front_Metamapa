import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';

// Este componente interno maneja los eventos de clic en el mapa
function MapEventsHandler({ onCoordenadasChange, position }) {
  const map = useMap();

  // Evento de clic en el mapa
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onCoordenadasChange(lat, lng); // Envía las nuevas coordenadas al formulario padre
    },
  });

  // Centra el mapa en la posición del marcador cada vez que cambia
  React.useEffect(() => {
    if (position[0] !== 0 && position[1] !== 0) {
      map.flyTo(position, 15); // 15 es el nivel de zoom
    }
  }, [position, map]);

  return null;
}

const MapaSelectorCoordenadas = ({ latitud, longitud, onCoordenadasChange }) => {
  // Posición por defecto (ej. Obelisco en Buenos Aires) si no hay coordenadas
  const defaultPosition = [-34.6037, -58.3816];
  
  // Determina la posición actual del marcador
  const position = [
    latitud || defaultPosition[0],
    longitud || defaultPosition[1]
  ];

  // Determina si el marcador debe mostrarse (solo si hay coords válidas)
  const markerVisible = latitud && longitud;

  return (
    <div className="h-64 md:h-80 w-full rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-700">
      <MapContainer 
        center={position} 
        zoom={markerVisible ? 15 : 10} // Zoom más lejano si no hay marcador
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Solo muestra el marcador si hay coordenadas seleccionadas */}
        {markerVisible && <Marker position={position}></Marker>}
        
        {/* Componente "invisible" que escucha los clics */}
        <MapEventsHandler 
          onCoordenadasChange={onCoordenadasChange} 
          position={position} 
        />
      </MapContainer>
    </div>
  );
};

export default MapaSelectorCoordenadas;