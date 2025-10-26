import React from 'react';
import { Box, Typography, Paper, Stack, Chip, alpha, Divider } from '@mui/material';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { CombinedWeatherData } from '../../hooks/useWeatherData';
import { formatTemperature, capitalizeDescription } from '../../utils/formatters';

interface CityForecastPreviewProps {
  weatherData: CombinedWeatherData;
}

const CityForecastPreview: React.FC<CityForecastPreviewProps> = ({ weatherData }) => {
  const { location, currentWeather } = weatherData;
  const iconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;

  const getWeatherGradient = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    } else if (weatherId >= 300 && weatherId < 600) {
      return 'linear-gradient(135deg, #5f72bd 0%, #9b23ea 100%)';
    } else if (weatherId >= 600 && weatherId < 700) {
      return 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)';
    } else if (weatherId >= 800) {
      return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    }
    return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        minWidth: { xs: 280, sm: 320 },
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: alpha('#000', 0.08),
      }}
    >
      {/* Header con gradiente */}
      <Box
        sx={{
          background: getWeatherGradient(currentWeather.weather[0].id),
          p: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Overlay decorativo */}
        <Box
          sx={{
            position: 'absolute',
            top: -20,
            right: -20,
            width: 100,
            height: 100,
            opacity: 0.2,
            background: 'radial-gradient(circle, white 0%, transparent 70%)',
          }}
        />

        <Stack direction="row" alignItems="center" gap={1} sx={{ position: 'relative' }}>
          <LocationOnIcon sx={{ color: 'white', fontSize: 18 }} />
          <Typography 
            variant="h6" 
            fontWeight={700}
            sx={{ 
              color: 'white',
              fontSize: '1.1rem',
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
              height: 20,
              fontSize: '0.65rem',
            }}
          />
        </Stack>

        <Typography 
          variant="caption" 
          sx={{ 
            color: alpha('#fff', 0.9),
            display: 'block',
            mt: 0.5,
            fontWeight: 500,
          }}
        >
          {capitalizeDescription(currentWeather.weather[0].description)}
        </Typography>
      </Box>

      {/* Contenido principal */}
      <Box sx={{ p: 2.5 }}>
        {/* Temperatura principal */}
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} mb={2}>
          <img 
            src={iconUrl} 
            alt={currentWeather.weather[0].description}
            style={{ 
              width: 70, 
              height: 70,
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
            }}
          />
          <Box>
            <Typography 
              variant="h2" 
              fontWeight={300}
              sx={{ 
                fontSize: '3rem',
                lineHeight: 1,
                color: 'text.primary',
              }}
            >
              {Math.round(currentWeather.main.temp)}°
            </Typography>
            <Typography variant="caption" color="text.secondary" fontWeight={500}>
              Sensación {formatTemperature(currentWeather.main.feels_like)}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        {/* Información adicional en grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
            mt: 2,
          }}
        >
          {/* Max temperatura */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha('#ef5350', 0.08),
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: alpha('#ef5350', 0.15),
              }}
            >
              <ArrowUpwardIcon sx={{ fontSize: 18, color: '#ef5350' }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                Máxima
              </Typography>
              <Typography variant="body2" fontWeight={700} color="#ef5350">
                {formatTemperature(currentWeather.main.temp_max)}
              </Typography>
            </Box>
          </Box>

          {/* Min temperatura */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha('#42a5f5', 0.08),
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: alpha('#42a5f5', 0.15),
              }}
            >
              <ArrowDownwardIcon sx={{ fontSize: 18, color: '#42a5f5' }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                Mínima
              </Typography>
              <Typography variant="body2" fontWeight={700} color="#42a5f5">
                {formatTemperature(currentWeather.main.temp_min)}
              </Typography>
            </Box>
          </Box>

          {/* Humedad */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha('#66bb6a', 0.08),
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: alpha('#66bb6a', 0.15),
              }}
            >
              <OpacityIcon sx={{ fontSize: 18, color: '#66bb6a' }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                Humedad
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {currentWeather.main.humidity}%
              </Typography>
            </Box>
          </Box>

          {/* Viento */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha('#ab47bc', 0.08),
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: alpha('#ab47bc', 0.15),
              }}
            >
              <AirIcon sx={{ fontSize: 18, color: '#ab47bc' }} />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
                Viento
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {currentWeather.wind.speed.toFixed(1)} m/s
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CityForecastPreview;