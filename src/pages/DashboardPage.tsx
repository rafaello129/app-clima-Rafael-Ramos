import React from 'react';
import { Container, Box, Typography } from '@mui/material';

import { useWeatherData } from '../hooks/useWeatherData';
import WeatherCard from '../components/WeatherCard/WeatherCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

interface DashboardPageProps {
  weatherHook: ReturnType<typeof useWeatherData>;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ weatherHook }) => {
  const { cities, data, loading, error, removeCity, refreshCity } = weatherHook;

  if (cities.length === 0 && loading.size === 0) {
    return (
      <Container maxWidth="md">
        <Typography variant="h5" align="center" color="text.secondary" sx={{ mt: 5 }}>
          Bienvenido al Clima
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 2 }}>
          Usa la barra de búsqueda para añadir tu primera ciudad y ver el pronóstico del tiempo.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
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
                onRemove={removeCity}
                onRefresh={refreshCity}
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