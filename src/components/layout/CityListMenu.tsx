import React, { useState } from 'react';
import { 
  IconButton, 
  Tooltip, 
  Menu, 
  MenuItem, 
  Popover, 
  Typography, 
  Box,
  Chip,
  alpha,
  useTheme,
  Stack,
  Divider,
  Badge,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import FoggyIcon from '@mui/icons-material/Foggy';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import { CombinedWeatherData } from '../../hooks/useWeatherData';
import CityForecastPreview from '../common/CityForecastPreview';

interface CityListMenuProps {
  cities: string[];
  weatherDataMap: Map<string, CombinedWeatherData>;
}

const CityListMenu: React.FC<CityListMenuProps> = ({ cities, weatherDataMap }) => {
  const theme = useTheme();
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLElement | null>(null);
  const [hoveredCityData, setHoveredCityData] = useState<CombinedWeatherData | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, city: string) => {
    const cityData = weatherDataMap.get(city.toLowerCase());
    if (cityData) {
      setPopoverAnchorEl(event.currentTarget);
      setHoveredCityData(cityData);
    }
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setHoveredCityData(null);
  };

  // Función para obtener el icono según el clima
  const getWeatherIcon = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) {
      return <ThunderstormIcon sx={{ fontSize: 20, color: '#9c27b0' }} />;
    } else if (weatherId >= 300 && weatherId < 600) {
      return <CloudIcon sx={{ fontSize: 20, color: '#2196f3' }} />;
    } else if (weatherId >= 600 && weatherId < 700) {
      return <AcUnitIcon sx={{ fontSize: 20, color: '#00bcd4' }} />;
    } else if (weatherId >= 700 && weatherId < 800) {
      return <FoggyIcon sx={{ fontSize: 20, color: '#9e9e9e' }} />;
    } else if (weatherId === 800) {
      return <WbSunnyIcon sx={{ fontSize: 20, color: '#ff9800' }} />;
    }
    return <CloudIcon sx={{ fontSize: 20, color: '#78909c' }} />;
  };

  // Función para obtener el color por temperatura
  const getTempColor = (temp: number) => {
    if (temp < 10) return '#4fc3f7';
    if (temp < 20) return '#66bb6a';
    if (temp < 30) return '#ffb74d';
    return '#ef5350';
  };

  const open = Boolean(popoverAnchorEl);
  const menuOpen = Boolean(menuAnchorEl);

  return (
    <>
      <Tooltip title="Ver ciudades guardadas">
        <IconButton 
          color="inherit" 
          onClick={handleMenuOpen}
          sx={{
            position: 'relative',
            '&:hover': {
              bgcolor: alpha('#fff', 0.15),
            },
          }}
        >
          <Badge 
            badgeContent={cities.length} 
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: alpha('#fff', 0.9),
                color: theme.palette.primary.main,
                fontWeight: 700,
                fontSize: '0.65rem',
                minWidth: 18,
                height: 18,
              },
            }}
          >
            <LocationCityIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            minWidth: 280,
            maxHeight: 400,
            mt: 1.5,
            borderRadius: 2,
            overflow: 'visible',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.15)}`,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderBottom: 'none',
              borderRight: 'none',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header del menú */}
        <Box sx={{ px: 2, py: 1.5, bgcolor: alpha(theme.palette.primary.main || '#1976d2', 0.05) }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                }}
              >
                <LocationCityIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Mis Ciudades
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {cities.length} {cities.length === 1 ? 'ciudad' : 'ciudades'} guardadas
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Lista de ciudades */}
        {cities.length > 0 ? (
          <Box sx={{ py: 0.5 }}>
            {cities.map((city, index) => {
              const cityData = weatherDataMap.get(city.toLowerCase());
              const temp = cityData?.currentWeather.main.temp;
              const weatherId = cityData?.currentWeather.weather[0].id;

              return (
                <MenuItem
                  key={city}
                  onMouseEnter={(e) => handlePopoverOpen(e, city)}
                  onMouseLeave={handlePopoverClose}
                  aria-owns={open ? 'mouse-over-popover' : undefined}
                  aria-haspopup="true"
                  sx={{
                    py: 1.5,
                    px: 2,
                    mx: 0.5,
                    my: 0.25,
                    borderRadius: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha('#667eea', 0.08),
                      transform: 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {weatherId ? getWeatherIcon(weatherId) : <LocationOnIcon sx={{ fontSize: 20, color: 'text.secondary' }} />}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={600}>
                        {city}
                      </Typography>
                    }
                    secondary={
                      cityData ? (
                        <Typography variant="caption" color="text.secondary">
                          {cityData.currentWeather.weather[0].description}
                        </Typography>
                      ) : null
                    }
                  />

                  {temp !== undefined && (
                    <Chip
                      icon={<ThermostatIcon sx={{ fontSize: 16 }} />}
                      label={`${Math.round(temp)}°C`}
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: alpha(getTempColor(temp), 0.15),
                        color: getTempColor(temp),
                        border: `1px solid ${alpha(getTempColor(temp), 0.3)}`,
                        '& .MuiChip-icon': {
                          color: getTempColor(temp),
                        },
                      }}
                    />
                  )}
                </MenuItem>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                margin: '0 auto',
                mb: 2,
                borderRadius: '50%',
                background: alpha(theme.palette.divider, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocationCityIcon sx={{ fontSize: 40, color: 'text.disabled' }} />
            </Box>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              No hay ciudades guardadas
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
              Busca y agrega ciudades para verlas aquí
            </Typography>
          </Box>
        )}

        {/* Footer con info */}
        {cities.length > 0 && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                💡 Pasa el cursor sobre una ciudad para ver más detalles
              </Typography>
            </Box>
          </>
        )}
      </Menu>

      {/* Popover con preview */}
      <Popover
        id="mouse-over-popover"
        sx={{ 
          pointerEvents: 'none',
          '& .MuiPopover-paper': {
            boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.2)}`,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          },
        }}
        open={open}
        anchorEl={popoverAnchorEl}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        disableScrollLock
      >
        {hoveredCityData && (
          <Box sx={{ m: 1 }}>
            <CityForecastPreview weatherData={hoveredCityData} />
          </Box>
        )}
      </Popover>
    </>
  );
};

export default CityListMenu;