import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

import { ForecastData } from '../../api/types';
import { formatDayOfWeek, formatTemperature, formatTime } from '../../utils/formatters';

import styles from './Forecast.module.css';

interface ForecastProps {
  forecast: ForecastData;
}

const groupForecastByDay = (list: ForecastData['list']) => {
  const grouped: { [key: string]: { temps: number[], icons: string[] } } = {};

  list.forEach(item => {
    const day = item.dt_txt.split(' ')[0]; 
    if (!grouped[day]) {
      grouped[day] = { temps: [], icons: [] };
    }
    grouped[day].temps.push(item.main.temp);
    grouped[day].icons.push(item.weather[0].icon);
  });

  return Object.entries(grouped).map(([day, data]) => {
    const midDayIcon = data.icons[Math.floor(data.icons.length / 2)] || data.icons[0];
    return {
      dt_txt: day,
      dt: new Date(day).getTime() / 1000,
      temp_max: Math.max(...data.temps),
      temp_min: Math.min(...data.temps),
      icon: midDayIcon,
    };
  });
};


const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  const { list, city } = forecast;
  
  const next24Hours = list.slice(0, 8);
  
  const dailyForecast = groupForecastByDay(list);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>Pronóstico por Horas</Typography>
      <Box className={styles.hourlyForecastContainer}>
        {next24Hours.map((hour) => (
          <Paper key={hour.dt} className={styles.hourlyItem} variant="outlined">
            <Typography variant="caption" color="text.secondary">
              {formatTime(hour.dt, city.timezone)}
            </Typography>
            <img src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} alt={hour.weather[0].description} className={styles.forecastIcon} />
            <Typography variant="subtitle2" component="p">
              {formatTemperature(hour.main.temp)}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>Pronóstico Semanal</Typography>
      <Box className={styles.dailyForecastContainer}>
        {dailyForecast.map((day) => (
          <Box key={day.dt} className={styles.dailyItem}>
            <Typography variant="body1" sx={{ flex: 1, fontWeight: '500' }}>
              {formatDayOfWeek(day.dt, city.timezone)}
            </Typography>
            <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt="weather icon" className={styles.forecastIcon} />
            <Typography variant="body1" sx={{ flex: 1, textAlign: 'right' }}>
              {formatTemperature(day.temp_max)}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ width: '40px', textAlign: 'right' }}>
              {formatTemperature(day.temp_min)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Forecast;