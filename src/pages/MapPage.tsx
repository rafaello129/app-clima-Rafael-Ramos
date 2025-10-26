import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { 
  Box, 
  Typography, 
  Paper, 
  alpha, 
  useTheme, 
  Stack,
  Chip,
  Container
} from '@mui/material';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExploreIcon from '@mui/icons-material/Explore';

import { useWeatherData } from '../hooks/useWeatherData';
import CityForecastPreview from '../components/common/CityForecastPreview';

// Icono personalizado mejorado
const createCustomIcon = (temp: number, condition: string) => {
  const getColorByTemp = (temperature: number) => {
    if (temperature < 10) return '#4fc3f7'; // Frío - Azul claro
    if (temperature < 20) return '#66bb6a'; // Templado - Verde
    if (temperature < 30) return '#ffb74d'; // Cálido - Naranja
    return '#ef5350'; // Caliente - Rojo
  };

  const color = getColorByTemp(temp);

  return L.divIcon({
    className: 'custom-weather-marker',
    html: `
      <div style="
        position: relative;
        width: 50px;
        height: 50px;
      ">
        <div style="
          background: ${color};
          width: 40px;
          height: 40px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s ease-in-out infinite;
        ">
          <div style="
            transform: rotate(45deg);
            color: white;
            font-size: 18px;
            font-weight: bold;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
          ">${Math.round(temp)}°</div>
        </div>
        <div style="
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 10px;
          font-weight: bold;
          color: ${color};
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          white-space: nowrap;
        ">${condition}</div>
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: rotate(-45deg) scale(1); }
          50% { transform: rotate(-45deg) scale(1.1); }
        }
      </style>
    `,
    iconSize: [50, 60],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });
};

const FitBounds: React.FC<{ bounds: L.LatLngBoundsExpression }> = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (Array.isArray(bounds) && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [80, 80], maxZoom: 10 });
    }
  }, [bounds, map]);
  return null;
};

interface MapPageProps {
  weatherHook: ReturnType<typeof useWeatherData>;
}

const MapPage: React.FC<MapPageProps> = ({ weatherHook }) => {
  const theme = useTheme();
  const { data } = weatherHook;
  const citiesWithData = Array.from(data.values());

  const bounds = useMemo(() => {
    if (citiesWithData.length === 0) return [];
    const latLngs = citiesWithData.map(city => [city.location.lat, city.location.lon] as L.LatLngTuple);
    return L.latLngBounds(latLngs);
  }, [citiesWithData]);

  // Estado vacío mejorado
  if (citiesWithData.length === 0) {
    return (
      <Container maxWidth="md">
        <Box 
          sx={{ 
            textAlign: 'center', 
            mt: 8,
            mb: 4,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha('#667eea', 0.05)} 0%, ${alpha('#764ba2', 0.05)} 100%)`,
              border: `2px dashed ${alpha(theme.palette.divider, 0.3)}`,
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto',
                mb: 3,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha('#667eea', 0.1)} 0%, ${alpha('#764ba2', 0.1)} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ExploreIcon sx={{ fontSize: 60, color: '#667eea' }} />
            </Box>
            
            <Typography 
              variant="h4" 
              fontWeight={700}
              gutterBottom
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Mapa sin ciudades
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mt: 2, mb: 3, maxWidth: 500, mx: 'auto' }}
            >
              Aún no has agregado ciudades para visualizar en el mapa. 
              Comienza buscando una ciudad desde la barra de navegación.
            </Typography>

            <Stack 
              direction="row" 
              spacing={1} 
              justifyContent="center"
              flexWrap="wrap"
              sx={{ mt: 3 }}
            >
              <Chip 
                icon={<LocationOnIcon />}
                label="Busca ciudades" 
                sx={{ 
                  bgcolor: alpha('#667eea', 0.1),
                  color: '#667eea',
                  fontWeight: 600,
                }}
              />
              <Chip 
                icon={<MapOutlinedIcon />}
                label="Visualiza en el mapa" 
                sx={{ 
                  bgcolor: alpha('#764ba2', 0.1),
                  color: '#764ba2',
                  fontWeight: 600,
                }}
              />
            </Stack>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Mapa con ciudades
  return (
    <Box sx={{ height: 'calc(100vh - 160px)', width: '100%', position: 'relative' }}>
 

      {/* Mapa */}
      <Box
        sx={{
          height: '100%',
          width: '100%',
          borderRadius: { xs: 0, sm: 3 },
          overflow: 'hidden', 
          boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
          '& .leaflet-container': {
            height: '100%',
            width: '100%',
          },
        }} 
      >
        <MapContainer
          center={[23.6345, -102.5528]} 
          zoom={5}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Capa de nubes */}
          <TileLayer
            url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=826b37548275c1f2cda3cca800b7fd08`}
            opacity={0.3}
          />

          {citiesWithData.map(cityData => {
            const temp = cityData.currentWeather.main.temp;
            const condition = cityData.currentWeather.weather[0].main;
            
            return (
              <React.Fragment key={cityData.location.name}>
                {/* Círculo de área */}
                <Circle
                  center={[cityData.location.lat, cityData.location.lon]}
                  radius={30000}
                  pathOptions={{
                    color: temp < 10 ? '#4fc3f7' : temp < 20 ? '#66bb6a' : temp < 30 ? '#ffb74d' : '#ef5350',
                    fillColor: temp < 10 ? '#4fc3f7' : temp < 20 ? '#66bb6a' : temp < 30 ? '#ffb74d' : '#ef5350',
                    fillOpacity: 0.1,
                    weight: 1,
                  }}
                />
                
                {/* Marcador */}
                <Marker 
                  position={[cityData.location.lat, cityData.location.lon]}
                  icon={createCustomIcon(temp, condition)}
                >
                  <Popup className="custom-weather-popup" closeButton={false}>
                    <CityForecastPreview weatherData={cityData} />
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
          
          <FitBounds bounds={bounds} />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default MapPage;