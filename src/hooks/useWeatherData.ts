import { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { getWeatherAndForecast } from '../api/openWeather';
import { GeoLocation, AirPollutionData, CurrentWeatherData, ForecastData } from '../api/types';

export interface CombinedWeatherData {
    location: GeoLocation;
    currentWeather: CurrentWeatherData;
    forecast: ForecastData;
    airPollution: AirPollutionData;
    timestamp: number;
  }

type WeatherDataState = {
  data: Map<string, CombinedWeatherData>;
  loading: Set<string>; 
  error: Map<string, string>; 
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos en milisegundos.


export const useWeatherData = () => {
    const [cities, setCities] = useLocalStorage<string[]>('cities', ['Ciudad de México']);

  const [state, setState] = useState<WeatherDataState>({
    data: new Map(),
    loading: new Set(),
    error: new Map(),
  });

  const fetchWeatherData = useCallback(async (city: string) => {
    const cityName = city.toLowerCase();

    if (state.loading.has(cityName)) return;

    const cachedData = state.data.get(cityName);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return; 
    }

    setState(prevState => ({
      ...prevState,
      loading: new Set(prevState.loading).add(cityName),
      error: new Map(prevState.error).set(cityName, ''), 
    }));

    try {
      const weatherInfo = await getWeatherAndForecast(city);
      setState(prevState => {
        const newData = new Map(prevState.data);
        newData.set(cityName, { ...weatherInfo, timestamp: Date.now() });

        const newLoading = new Set(prevState.loading);
        newLoading.delete(cityName);

        return { ...prevState, data: newData, loading: newLoading };
      });
    } catch (err: any) {
      console.error(`Error fetching data for ${city}:`, err);
      setState(prevState => {
        const newLoading = new Set(prevState.loading);
        newLoading.delete(cityName);

        const newError = new Map(prevState.error);
        newError.set(cityName, err.message || 'Ocurrió un error desconocido.');

        return { ...prevState, loading: newLoading, error: newError };
      });
    }
  }, [state.data, state.loading]);

  useEffect(() => {
    cities.forEach(city => fetchWeatherData(city));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const addCity = (city: string) => {
    const cityName = city.toLowerCase();
    if (!cities.map(c => c.toLowerCase()).includes(cityName)) {
      setCities([...cities, city]);
      fetchWeatherData(city);
    }
  };

  const removeCity = (city: string) => {
    const cityName = city.toLowerCase();
    setCities(cities.filter(c => c.toLowerCase() !== cityName));
    
    setState(prevState => {
      const newData = new Map(prevState.data);
      newData.delete(cityName);
      const newError = new Map(prevState.error);
      newError.delete(cityName);
      return { ...prevState, data: newData, error: newError };
    });
  };

  const clearAllCities = () => {
    setCities([]);
    setState({
      data: new Map(),
      loading: new Set(),
      error: new Map(),
    });
  };

  return { ...state, cities, addCity, removeCity, refreshCity: fetchWeatherData, clearAllCities };
};