import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link as RouterLink } from 'react-router-dom';

import SearchBar from '../SearchBar/SearchBar';
import ThemeToggleButton from './ThemeToggleButton';
import CityListMenu from './CityListMenu'; 
import { CombinedWeatherData } from '../../hooks/useWeatherData';
import MapIcon from '@mui/icons-material/Map'; 
interface HeaderProps {
  onSearch: (city: string) => void;
  cities: string[]; 
  weatherDataMap: Map<string, CombinedWeatherData>; 
}

const Header: React.FC<HeaderProps> = ({ onSearch, cities, weatherDataMap }) => {
  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WbSunnyIcon sx={{ mr: 1.5 }} />
            <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              Clima
            </Typography>
          </Box>
        </RouterLink>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SearchBar onSearch={onSearch} />
          
          <CityListMenu cities={cities} weatherDataMap={weatherDataMap} />
          <Tooltip title="Ver mapa de ciudades">
            <IconButton component={RouterLink} to="/map" color="inherit">
              <MapIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Configuración">
            <IconButton component={RouterLink} to="/settings" color="inherit">
              <SettingsIcon />
            </IconButton>
          </Tooltip>

          <ThemeToggleButton />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;