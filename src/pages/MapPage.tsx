import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography } from '@mui/material';

import { useWeatherData } from '../hooks/useWeatherData';
import CityForecastPreview from '../components/common/CityForecastPreview';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const FitBounds: React.FC<{ bounds: L.LatLngBoundsExpression }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (Array.isArray(bounds) && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

interface MapPageProps {
  weatherHook: ReturnType<typeof useWeatherData>;
}

const MapPage: React.FC<MapPageProps> = ({ weatherHook }) => {
  const { data } = weatherHook;
  const citiesWithData = Array.from(data.values());

  const bounds = useMemo(() => {
    if (citiesWithData.length === 0) return [];
    const latLngs = citiesWithData.map(city => [city.location.lat, city.location.lon] as L.LatLngTuple);
    return L.latLngBounds(latLngs);
  }, [citiesWithData]);

  if (citiesWithData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h5" color="text.secondary">
          No hay ciudades para mostrar en el mapa.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          Añade una ciudad desde la barra de búsqueda para verla aquí.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 'calc(100vh - 160px)', width: '100%' }}>
      <MapContainer
        center={[23.6345, -102.5528]} 
        zoom={5}
        style={{ height: '100%', width: '100%', borderRadius: '8px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {citiesWithData.map(cityData => (
          <Marker key={cityData.location.name} position={[cityData.location.lat, cityData.location.lon]}>
            <Popup>
              <CityForecastPreview weatherData={cityData} />
            </Popup>
          </Marker>
        ))}
        <FitBounds bounds={bounds} />
      </MapContainer>
    </Box>
  );
};

export default MapPage;