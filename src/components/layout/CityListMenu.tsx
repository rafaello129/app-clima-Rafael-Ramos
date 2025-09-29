import React, { useState } from 'react';
import { IconButton, Tooltip, Menu, MenuItem, Popover, Typography, Box } from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { CombinedWeatherData } from '../../hooks/useWeatherData';
import CityForecastPreview from '../common/CityForecastPreview';

interface CityListMenuProps {
  cities: string[];
  weatherDataMap: Map<string, CombinedWeatherData>;
}

const CityListMenu: React.FC<CityListMenuProps> = ({ cities, weatherDataMap }) => {
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

  const open = Boolean(popoverAnchorEl);

  return (
    <>
      <Tooltip title="Ver lista de ciudades">
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <LocationCityIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {cities.length > 0 ? (
          cities.map((city) => (
            <MenuItem
              key={city}
              onMouseEnter={(e) => handlePopoverOpen(e, city)}
              onMouseLeave={handlePopoverClose}
              aria-owns={open ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
            >
              <Typography>{city}</Typography>
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No hay ciudades guardadas.</MenuItem>
        )}
      </Menu>
      <Popover
        id="mouse-over-popover"
        sx={{ pointerEvents: 'none' }}
        open={open}
        anchorEl={popoverAnchorEl}
        anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
        transformOrigin={{ vertical: 'center', horizontal: 'left' }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        {hoveredCityData && <CityForecastPreview weatherData={hoveredCityData} />}
      </Popover>
    </>
  );
};

export default CityListMenu;