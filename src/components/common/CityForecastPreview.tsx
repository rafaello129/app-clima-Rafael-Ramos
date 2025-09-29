import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CombinedWeatherData } from '../../hooks/useWeatherData';
import { formatTemperature, capitalizeDescription } from '../../utils/formatters';

interface CityForecastPreviewProps {
  weatherData: CombinedWeatherData;
}

const CityForecastPreview: React.FC<CityForecastPreviewProps> = ({ weatherData }) => {
  const { location, currentWeather } = weatherData;
  const iconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png`;

  return (
    <Paper elevation={4} sx={{ p: 2, minWidth: 220 }}>
      <Typography variant="h6" component="div">
        {location.name}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <img src={iconUrl} alt={currentWeather.weather[0].description} style={{ width: 50, height: 50 }} />
        <Typography variant="h4" sx={{ ml: 1 }}>
          {formatTemperature(currentWeather.main.temp)}
        </Typography>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {capitalizeDescription(currentWeather.weather[0].description)}
      </Typography>
      <Typography variant="caption" display="block">
        Máx: {formatTemperature(currentWeather.main.temp_max)} / Mín: {formatTemperature(currentWeather.main.temp_min)}
      </Typography>
    </Paper>
  );
};

export default CityForecastPreview;