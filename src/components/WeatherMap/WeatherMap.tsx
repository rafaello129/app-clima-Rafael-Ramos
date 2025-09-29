import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet';

import styles from './WeatherMap.module.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41], 
});

L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherMapProps {
  lat: number;
  lon: number;
  cityName: string;
}

const API_KEY = '826b37548275c1f2cda3cca800b7fd08'; 

const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lon, cityName }) => {
  return (
    <MapContainer center={[lat, lon]} zoom={10} className={styles.mapContainer}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <TileLayer
        url={`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
        attribution='&copy; <a href="https://openweathermap.org/">OpenWeather</a>'
      />

      <Marker position={[lat, lon]}>
        <Popup>{cityName}</Popup>
      </Marker>
    </MapContainer>
  );
};

export default WeatherMap;