import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton, 
  Tooltip,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import SettingsIcon from '@mui/icons-material/Settings';
import MapIcon from '@mui/icons-material/Map';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';

import SearchBar from '../SearchBar/SearchBar';
import ThemeToggleButton from './ThemeToggleButton';
import CityListMenu from './CityListMenu';
import { CombinedWeatherData } from '../../hooks/useWeatherData';

interface HeaderProps {
  onSearch: (city: string) => void;
  cities: string[];
  weatherDataMap: Map<string, CombinedWeatherData>;
  onUseCurrentLocation?: () => void; // Nueva prop para geolocalización
}

const Header: React.FC<HeaderProps> = ({ 
  onSearch, 
  cities, 
  weatherDataMap,
  onUseCurrentLocation 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar>
        {/* Logo */}
        <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WbSunnyIcon sx={{ mr: { xs: 0.5, sm: 1.5 } }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              Clima
            </Typography>
          </Box>
        </RouterLink>

        <Box sx={{ flexGrow: 1 }} />

        {/* Barra de búsqueda */}
        <SearchBar onSearch={onSearch} recentCities={cities} />

        {/* Menú Desktop */}
        {!isMobile ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
            {onUseCurrentLocation && (
              <Tooltip title="Usar mi ubicación">
                <IconButton onClick={onUseCurrentLocation} color="inherit">
                  <MyLocationIcon />
                </IconButton>
              </Tooltip>
            )}
            
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
        ) : (
          /* Menú Mobile */
          <>
            <IconButton
              color="inherit"
              onClick={handleMobileMenuOpen}
              sx={{ ml: 1 }}
            >
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
            >
              {onUseCurrentLocation && (
                <MenuItem onClick={() => {
                  onUseCurrentLocation();
                  handleMobileMenuClose();
                }}>
                  <ListItemIcon>
                    <MyLocationIcon />
                  </ListItemIcon>
                  <ListItemText>Mi ubicación</ListItemText>
                </MenuItem>
              )}
              
              <MenuItem 
                component={RouterLink} 
                to="/map"
                onClick={handleMobileMenuClose}
              >
                <ListItemIcon>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText>Mapa</ListItemText>
              </MenuItem>
              
              <MenuItem 
                component={RouterLink} 
                to="/settings"
                onClick={handleMobileMenuClose}
              >
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Configuración</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;