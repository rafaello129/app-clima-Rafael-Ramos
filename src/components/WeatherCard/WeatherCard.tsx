import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Box, 
  Tooltip, 
  Divider,
  Chip,
  alpha,
  useTheme,
  Stack,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import MapIcon from '@mui/icons-material/Map';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SpeedIcon from '@mui/icons-material/Speed';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CompressIcon from '@mui/icons-material/Compress';

import { CombinedWeatherData } from '../../hooks/useWeatherData';
import { capitalizeDescription, formatTemperature, formatTime, getAqiText } from '../../utils/formatters';
import { getWeatherRecommendation } from '../../utils/recommendations';
import Forecast from '../Forecast/Forecast';
import WeatherMap from '../WeatherMap/WeatherMap';

interface WeatherCardProps {
  weatherData: CombinedWeatherData;
  onRemove: (city: string) => void;
  onRefresh: (city: string) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, onRemove, onRefresh }) => {
  const [showMap, setShowMap] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { location, currentWeather, forecast, airPollution } = weatherData;

  const aqiInfo = getAqiText(airPollution.list[0].main.aqi);
  const recommendation = getWeatherRecommendation(currentWeather.weather[0].id);
  const weatherIconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`;

  const safeColors = {
    info: '#0288d1',
    primary: '#1976d2',
    warning: '#ed6c02',
    secondary: '#9c27b0',
    success: '#2e7d32',
    error: '#d32f2f',
  };

  const getWeatherGradient = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (weatherId >= 300 && weatherId < 600) {
      return 'linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%)';
    } else if (weatherId >= 600 && weatherId < 700) {
      return 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)';
    } else if (weatherId >= 700 && weatherId < 800) {
      return 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)';
    } else if (weatherId === 800) {
      return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else {
      return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    }
  };

  const InfoCard = ({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: { xs: 1, sm: 1.5 },
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s ease',
        textAlign: { xs: 'center', sm: 'left' },
        '&:hover': {
          transform: { xs: 'scale(1.02)', sm: 'translateY(-2px)' },
          boxShadow: `0 4px 12px ${color}`,
          borderColor: color,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: { xs: 36, sm: 40 },
          height: { xs: 36, sm: 40 },
          borderRadius: '50%',
          bgcolor: color, // ✅ FIX: Usar alpha para el fondo
          color: color, // ✅ Color del icono
          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon as React.ReactElement, { 
        })}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block', 
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {label}
        </Typography>
        <Typography 
          variant="body2" 
          fontWeight={600} 
          sx={{ 
            mt: 0.25,
            fontSize: { xs: '0.85rem', sm: '0.875rem' },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Card 
      elevation={0}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: 3, sm: 4 },
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: { xs: 'none', sm: `0 8px 24px ${alpha(safeColors.primary, 0.12)}` },
          transform: { xs: 'none', sm: 'translateY(-4px)' },
        },
      }}
    >
      {/* Header con gradiente */}
      <Box
        sx={{
          background: getWeatherGradient(currentWeather.weather[0].id),
          p: { xs: 2, sm: 3 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Overlay decorativo */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: { xs: '150px', sm: '200px' },
            height: { xs: '150px', sm: '200px' },
            opacity: 0.1,
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
          }}
        />

        {/* Header Content */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box display="flex" alignItems="center" gap={1} mb={0.5} flexWrap="wrap">
                <LocationOnIcon sx={{ color: 'white', fontSize: { xs: 18, sm: 20 } }} />
                <Typography 
                  variant="h5" 
                  fontWeight={700} 
                  color="white" 
                  sx={{ 
                    fontSize: { xs: '1.25rem', sm: '1.5rem' },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {location.name}
                </Typography>
                <Chip 
                  label={location.country} 
                  size="small" 
                  sx={{ 
                    bgcolor: alpha('#fff', 0.2),
                    color: 'white',
                    fontWeight: 600,
                    height: { xs: 20, sm: 24 },
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  }} 
                />
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: alpha('#fff', 0.9), 
                  fontWeight: 500,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                }}
              >
                {capitalizeDescription(currentWeather.weather[0].description)}
              </Typography>
            </Box>

            <Stack 
              direction="row" 
              spacing={{ xs: 0.25, sm: 0.5 }} 
              flexShrink={0}
            >
              {!isMobile && (
                <Tooltip title={expanded ? "Contraer" : "Expandir"}>
                  <IconButton 
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    sx={{ 
                      color: 'white',
                      bgcolor: alpha('#fff', 0.15),
                      '&:hover': { bgcolor: alpha('#fff', 0.25) },
                      width: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
                    }}
                  >
                    {expanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title={showMap ? "Ocultar mapa" : "Mostrar mapa"}>
                <IconButton 
                  size="small"
                  onClick={() => setShowMap(!showMap)}
                  sx={{ 
                    color: 'white',
                    bgcolor: alpha('#fff', 0.15),
                    '&:hover': { bgcolor: alpha('#fff', 0.25) },
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                  }}
                >
                  <MapIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Actualizar datos">
                <IconButton 
                  size="small"
                  onClick={() => onRefresh(location.name)}
                  sx={{ 
                    color: 'white',
                    bgcolor: alpha('#fff', 0.15),
                    '&:hover': { bgcolor: alpha('#fff', 0.25) },
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar ciudad">
                <IconButton 
                  size="small"
                  onClick={() => onRemove(location.name)}
                  sx={{ 
                    color: 'white',
                    bgcolor: alpha('#fff', 0.15),
                    '&:hover': { bgcolor: alpha('#ff0000', 0.3) },
                    width: { xs: 32, sm: 36 },
                    height: { xs: 32, sm: 36 },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Temperatura principal */}
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            mt={{ xs: 2, sm: 3 }}
          >
            <Box display="flex" alignItems="flex-start">
              <Typography 
                variant="h1" 
                sx={{ 
                  fontSize: { xs: '3.5rem', sm: '5rem', md: '6rem' },
                  fontWeight: 300,
                  color: 'white',
                  lineHeight: 1,
                  textShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                {Math.round(currentWeather.main.temp)}
              </Typography>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: alpha('#fff', 0.8), 
                  mt: { xs: 0.5, sm: 1 },
                  fontWeight: 300,
                  fontSize: { xs: '1.5rem', sm: '2rem' },
                }}
              >
                °C
              </Typography>
            </Box>
            <img 
              src={weatherIconUrl} 
              alt={currentWeather.weather[0].description}
              style={{ 
                width: isMobile ? '80px' : '120px', 
                height: isMobile ? '80px' : '120px',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))',
              }}
            />
          </Box>

          {/* Min/Max temperatura */}
          <Box display="flex" gap={{ xs: 1, sm: 2 }} mt={2} flexWrap="wrap">
            <Chip
              icon={<ThermostatIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
              label={`Sensación: ${formatTemperature(currentWeather.main.feels_like)}`}
              sx={{
                bgcolor: alpha('#fff', 0.2),
                color: 'white',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                height: { xs: 26, sm: 32 },
                fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              }}
            />
            <Chip
              label={`↑ ${formatTemperature(currentWeather.main.temp_max)}`}
              sx={{
                bgcolor: alpha('#fff', 0.2),
                color: 'white',
                fontWeight: 600,
                height: { xs: 26, sm: 32 },
                fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              }}
            />
            <Chip
              label={`↓ ${formatTemperature(currentWeather.main.temp_min)}`}
              sx={{
                bgcolor: alpha('#fff', 0.2),
                color: 'white',
                fontWeight: 600,
                height: { xs: 26, sm: 32 },
                fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Content */}
      {expanded && (
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          {/* Recomendación */}
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              mb: { xs: 2, sm: 3 },
              borderRadius: 2,
              bgcolor: alpha(safeColors.info, 0.08),
              border: `1px solid ${alpha(safeColors.info, 0.2)}`,
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                fontWeight: 500,
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
              }}
            >
              💡 {recommendation}
            </Typography>
          </Box>

          {/* Grid de información */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { 
                xs: 'repeat(2, 1fr)', 
                sm: 'repeat(3, 1fr)' 
              },
              gap: { xs: 1.5, sm: 2 },
              mb: { xs: 2, sm: 3 },
            }}
          >
            <InfoCard
              icon={<SpeedIcon />}
              label="Viento"
              value={`${currentWeather.wind.speed.toFixed(1)} m/s`}
              color={safeColors.info}
            />
            <InfoCard
              icon={<OpacityIcon />}
              label="Humedad"
              value={`${currentWeather.main.humidity}%`}
              color={safeColors.primary}
            />
            <InfoCard
              icon={<AirIcon />}
              label="Calidad del aire"
              value={aqiInfo.text}
              color={aqiInfo.color || safeColors.success}
            />
            <InfoCard
              icon={<WbSunnyIcon />}
              label="Amanecer"
              value={formatTime(currentWeather.sys.sunrise, currentWeather.timezone)}
              color={safeColors.warning}
            />
            <InfoCard
              icon={<WbTwilightIcon />}
              label="Atardecer"
              value={formatTime(currentWeather.sys.sunset, currentWeather.timezone)}
              color={safeColors.secondary}
            />
            <InfoCard
              icon={<CompressIcon />}
              label="Presión"
              value={`${currentWeather.main.pressure} hPa`}
              color={safeColors.success}
            />
          </Box>

          <Divider sx={{ my: { xs: 2, sm: 3 } }} />

          {/* Pronóstico */}
          <Typography 
            variant="h6" 
            fontWeight={600} 
            mb={2}
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Pronóstico extendido
          </Typography>
          <Forecast forecast={forecast} />

          {/* Mapa */}
          {showMap && (
            <Box mt={{ xs: 2, sm: 3 }}>
              <Typography 
                variant="h6" 
                fontWeight={600} 
                mb={2}
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                Mapa del clima
              </Typography>
              <WeatherMap lat={location.lat} lon={location.lon} cityName={location.name} />
            </Box>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default WeatherCard;