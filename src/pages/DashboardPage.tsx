import React from 'react';
import { Container, Box, Typography, Paper, alpha, useTheme } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

import { useWeatherData } from '../hooks/useWeatherData';
import WeatherCard from '../components/WeatherCard/WeatherCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

interface DashboardPageProps {
  weatherHook: ReturnType<typeof useWeatherData>;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ weatherHook }) => {
  const theme = useTheme();
  const { cities, data, loading, error, removeCity, refreshCity } = weatherHook;

  if (cities.length === 0 && loading.size === 0) {
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
              <WbSunnyIcon sx={{ fontSize: 60, color: '#667eea' }} />
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
              Bienvenido a Clima
            </Typography>
            
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mt: 2, maxWidth: 500, mx: 'auto' }}
            >
              Usa la barra de búsqueda en la parte superior para añadir tu primera ciudad 
              y comenzar a ver el pronóstico del tiempo en tiempo real.
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
        {cities.map((city) => {
          const cityName = city.toLowerCase();
          const cityData = data.get(cityName);
          const cityError = error.get(cityName);
          const isLoading = loading.has(cityName);

          if (isLoading && !cityData) {
            return <LoadingSpinner key={cityName} message={`Cargando datos para ${city}...`} size={50} />;
          }

          if (cityError) {
            return (
              <ErrorMessage
                key={cityName}
                message={`No se pudieron cargar los datos para ${city}: ${cityError}`}
                onRetry={() => refreshCity(city)}
              />
            );
          }

          if (cityData) {
            return (
              <WeatherCard
                key={cityName}
                weatherData={cityData}
                // ✅ FIX: Pasar el nombre original de la ciudad, no el de location
                onRemove={() => removeCity(city)}
                onRefresh={() => refreshCity(city)}
              />
            );
          }

          return null;
        })}
      </Box>
    </Container>
  );
};

export default DashboardPage;