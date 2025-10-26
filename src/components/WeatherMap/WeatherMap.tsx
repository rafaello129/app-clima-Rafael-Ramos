import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet';
import { Box, Typography, Chip, Stack, alpha, useTheme, Paper, IconButton, Tooltip } from '@mui/material';
import { useRef } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CloudIcon from '@mui/icons-material/Cloud';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

import styles from './WeatherMap.module.css';

// Icono personalizado más moderno
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 40px;
      height: 40px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bounce 2s ease-in-out infinite;
    ">
      <div style="
        transform: rotate(45deg);
        font-size: 20px;
      ">📍</div>
    </div>
    <style>
      @keyframes bounce {
        0%, 100% { transform: rotate(-45deg) translateY(0); }
        50% { transform: rotate(-45deg) translateY(-5px); }
      }
    </style>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface WeatherMapProps {
  lat: number;
  lon: number;
  cityName: string;
}


const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lon, cityName }) => {
  const theme = useTheme();
  const mapRef = useRef<L.Map | null>(null);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lon], 10);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          mb: 2,
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.9),
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
                borderRadius: 2,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                boxShadow: `0 4px 12px ${alpha('#667eea', 0.3)}`,
              }}
            >
              <MapOutlinedIcon sx={{ fontSize: { xs: 20, sm: 22 } }} />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                sx={{ 
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Mapa Meteorológico
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                  📍 {cityName}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: { xs: '0.65rem', sm: '0.7rem' },
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  • {lat.toFixed(2)}°, {lon.toFixed(2)}°
                </Typography>
              </Stack>
            </Box>
          </Box>

          {/* Controles de zoom personalizados */}
          <Stack direction="row" spacing={1}>
            <Tooltip title="Alejar">
              <IconButton
                size="small"
                onClick={handleZoomOut}
                sx={{
                  bgcolor: alpha(theme.palette.background.default, 0.8),
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  '&:hover': {
                    bgcolor: alpha('#667eea', 0.1),
                    borderColor: '#667eea',
                    color: '#667eea',
                  },
                }}
              >
                <ZoomOutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Centrar">
              <IconButton
                size="small"
                onClick={handleRecenter}
                sx={{
                  bgcolor: alpha(theme.palette.background.default, 0.8),
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  '&:hover': {
                    bgcolor: alpha('#667eea', 0.1),
                    borderColor: '#667eea',
                    color: '#667eea',
                  },
                }}
              >
                <MyLocationIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Acercar">
              <IconButton
                size="small"
                onClick={handleZoomIn}
                sx={{
                  bgcolor: alpha(theme.palette.background.default, 0.8),
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  '&:hover': {
                    bgcolor: alpha('#667eea', 0.1),
                    borderColor: '#667eea',
                    color: '#667eea',
                  },
                }}
              >
                <ZoomInIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>

      {/* Mapa */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          '& .leaflet-container': {
            borderRadius: 3,
          },
        }}
      >
        <MapContainer 
          center={[lat, lon]} 
          zoom={10} 
          className={styles.mapContainer}
          style={{
            height: '500px',
            width: '100%',
            zIndex: 0,
          }}
          ref={mapRef}
        >
          {/* Mapa base con estilo mejorado */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
       

          {/* Círculo de área con efecto pulsante */}
          <Circle
            center={[lat, lon]}
            radius={5000}
            pathOptions={{
              color: '#667eea',
              fillColor: '#667eea',
              fillOpacity: 0.08,
              weight: 2,
              dashArray: '10, 5',
            }}
          />

          <Circle
            center={[lat, lon]}
            radius={2000}
            pathOptions={{
              color: '#764ba2',
              fillColor: '#764ba2',
              fillOpacity: 0.15,
              weight: 2,
            }}
          />

          {/* Marcador personalizado */}
          <Marker position={[lat, lon]} icon={customIcon}>
            <Popup
              closeButton={false}
              className="custom-popup"
            >
              <Box
                sx={{
                  p: 2,
                  minWidth: 180,
                }}
              >
                <Stack spacing={1.5}>
                  <Box>
                    <Typography 
                      variant="subtitle2" 
                      fontWeight={700}
                      gutterBottom
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      <LocationOnIcon sx={{ fontSize: 18, color: '#667eea' }} />
                      {cityName}
                    </Typography>
                  </Box>
                  
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: 1,
                      fontSize: '0.75rem',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Latitud:
                    </Typography>
                    <Typography variant="caption" color="text.primary" fontWeight={500}>
                      {lat.toFixed(4)}°
                    </Typography>
                    
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                      Longitud:
                    </Typography>
                    <Typography variant="caption" color="text.primary" fontWeight={500}>
                      {lon.toFixed(4)}°
                    </Typography>
                  </Box>

                  <Chip 
                    icon={<CloudIcon sx={{ fontSize: 14 }} />}
                    label="Capa de nubes activa"
                    size="small"
                    sx={{ 
                      fontSize: '0.65rem',
                      height: 24,
                      background: alpha('#667eea', 0.1),
                      color: '#667eea',
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Box>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Badge de capa activa */}
    
      </Box>

      {/* Información adicional */}

    </Box>
  );
};

export default WeatherMap;