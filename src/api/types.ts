
export interface GeoLocation {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
  }
  

  interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
  }

  export interface CurrentWeatherData {
    coord: { lon: number; lat: number };
    weather: WeatherCondition[];
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    visibility: number;
    wind: {
      speed: number;
      deg: number;
    };
    clouds: {
      all: number;
    };
    dt: number;
    sys: {
      country: string;
      sunrise: number;
      sunset: number;
    };
    timezone: number;
    name: string;
  }
  

  export interface ForecastListItem {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: WeatherCondition[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
    };
    pop: number; 
    dt_txt: string; 
  }
  

  export interface ForecastData {
    list: ForecastListItem[];
    city: {
      name: string;
      country: string;
      sunrise: number;
      sunset: number;
      timezone: number;
    };
  }
  
  export interface AirPollutionData {
    list: {
      main: { aqi: 1 | 2 | 3 | 4 | 5 };
    }[];
  }