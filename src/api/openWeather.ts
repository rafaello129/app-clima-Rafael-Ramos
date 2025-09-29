import axios from 'axios';
import { CurrentWeatherData, ForecastData, AirPollutionData, GeoLocation } from './types';

const API_KEY = '826b37548275c1f2cda3cca800b7fd08'; 
const apiClient = axios.create({
  baseURL: 'https://api.openweathermap.org',
});


const getCoordsByCity = async (city: string): Promise<GeoLocation> => {
  const response = await apiClient.get('/geo/1.0/direct', {
    params: { q: city, limit: 1, appid: API_KEY },
  });

  if (response.data.length === 0) {
    throw new Error('Ciudad no encontrada. Por favor, intenta con otro nombre.');
  }
  return response.data[0];
};


const getCurrentWeather = async (lat: number, lon: number): Promise<CurrentWeatherData> => {
  const response = await apiClient.get('/data/2.5/weather', {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'es' },
  });
  return response.data;
};

const get5DayForecast = async (lat: number, lon: number): Promise<ForecastData> => {
  const response = await apiClient.get('/data/2.5/forecast', {
    params: { lat, lon, appid: API_KEY, units: 'metric', lang: 'es' },
  });
  return response.data;
};


const getAirPollution = async (lat: number, lon: number): Promise<AirPollutionData> => {
  const response = await apiClient.get('/data/2.5/air_pollution', {
    params: { lat, lon, appid: API_KEY },
  });
  return response.data;
};


export const getWeatherAndForecast = async (city: string) => {
    const location = await getCoordsByCity(`${city},MX`);
    const { lat, lon } = location;

  const [currentWeather, forecast, airPollution] = await Promise.all([
    getCurrentWeather(lat, lon),
    get5DayForecast(lat, lon),
    getAirPollution(lat, lon),
  ]);

  return {
    location,
    currentWeather,
    forecast,
    airPollution,
  };
};