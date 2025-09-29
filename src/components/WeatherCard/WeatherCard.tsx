import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, IconButton, Box, Tooltip, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import MapIcon from '@mui/icons-material/Map';
import AirIcon from '@mui/icons-material/Air';
import OpacityIcon from '@mui/icons-material/Opacity';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SpeedIcon from '@mui/icons-material/Speed';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';

import { CombinedWeatherData } from '../../hooks/useWeatherData';
import { capitalizeDescription, formatTemperature, formatTime, getAqiText } from '../../utils/formatters';
import { getWeatherRecommendation } from '../../utils/recommendations';
import Forecast from '../Forecast/Forecast';
import WeatherMap from '../WeatherMap/WeatherMap';

import styles from './WeatherCard.module.css';

interface WeatherCardProps {
  weatherData: CombinedWeatherData;
  onRemove: (city: string) => void;
  onRefresh: (city: string) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weatherData, onRemove, onRefresh }) => {
  const [showMap, setShowMap] = useState(false);

  const { location, currentWeather, forecast, airPollution } = weatherData;

  const aqiInfo = getAqiText(airPollution.list[0].main.aqi);
  const recommendation = getWeatherRecommendation(currentWeather.weather[0].id);
  const weatherIconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@4x.png`;

  return (
    <Card elevation={3} className={styles.weatherCard}>
      <CardHeader
        title={`${location.name}, ${location.country}`}
        subheader={capitalizeDescription(currentWeather.weather[0].description)}
        action={
          <>
            <Tooltip title={showMap ? "Ocultar mapa" : "Mostrar mapa"}>
              <IconButton aria-label="toggle map" onClick={() => setShowMap(!showMap)}>
                <MapIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualizar datos">
              <IconButton aria-label="refresh" onClick={() => onRefresh(location.name)}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar ciudad">
              <IconButton aria-label="remove" onClick={() => onRemove(location.name)}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </>
        }
      />
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h2" component="p" className={styles.mainTemp}>
            {formatTemperature(currentWeather.main.temp)}
          </Typography>
          <img src={weatherIconUrl} alt={currentWeather.weather[0].description} className={styles.weatherIcon} />
        </Box>
        
        <Typography variant="body1" gutterBottom>
          Sensación térmica: {formatTemperature(currentWeather.main.feels_like)}.
          <span style={{ marginLeft: '8px' }}>
            Máx: {formatTemperature(currentWeather.main.temp_max)} / Mín: {formatTemperature(currentWeather.main.temp_min)}
          </span>
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          {recommendation}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            rowGap: 2,
            columnGap: 1,
          }}
        >
          <Box className={styles.detailItem}>
            <SpeedIcon fontSize="small" />
            <Typography variant="body2">Viento: {currentWeather.wind.speed.toFixed(1)} m/s</Typography>
          </Box>
          <Box className={styles.detailItem}>
            <OpacityIcon fontSize="small" />
            <Typography variant="body2">Humedad: {currentWeather.main.humidity}%</Typography>
          </Box>
          <Box className={styles.detailItem}>
            <AirIcon fontSize="small" />
            <Typography variant="body2" sx={{ color: aqiInfo.color }}>
              Aire: {aqiInfo.text}
            </Typography>
          </Box>
          <Box className={styles.detailItem}>
            <WbSunnyIcon fontSize="small" />
            <Typography variant="body2">Amanecer: {formatTime(currentWeather.sys.sunrise, currentWeather.timezone)}</Typography>
          </Box>
          <Box className={styles.detailItem}>
            <WbTwilightIcon fontSize="small" />
            <Typography variant="body2">Atardecer: {formatTime(currentWeather.sys.sunset, currentWeather.timezone)}</Typography>
          </Box>
        </Box>
        
        <Forecast forecast={forecast} />

        {showMap && <WeatherMap lat={location.lat} lon={location.lon} cityName={location.name} />}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;