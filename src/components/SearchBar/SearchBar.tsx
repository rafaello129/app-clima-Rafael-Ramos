import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box, 
  List, 
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ClickAwayListener,
  Divider,
  Typography,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HistoryIcon from '@mui/icons-material/History';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import axios from 'axios';

interface SearchBarProps {
  onSearch: (city: string) => void;
  recentCities?: string[];
}

interface CitySuggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

const API_KEY = '826b37548275c1f2cda3cca800b7fd08';

// Ciudades populares de México como fallback
const popularCities = [
  'Ciudad de México', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana',
  'León', 'Juárez', 'Zapopan', 'Mérida', 'Querétaro'
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, recentCities = [] }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Función para buscar ciudades en la API de OpenWeather (con useCallback)
  const searchCities = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    // Cancelar búsqueda anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      const response = await axios.get(
        'https://api.openweathermap.org/geo/1.0/direct',
        {
          params: {
            q: `${searchQuery},MX`, // Buscar solo en México
            limit: 5,
            appid: API_KEY
          },
          signal: abortControllerRef.current.signal
        }
      );

      setSuggestions(response.data);
      setShowSuggestions(response.data.length > 0);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Search cancelled');
      } else {
        console.error('Error searching cities:', error);
        // Fallback a búsqueda local si falla la API
        const filtered = popularCities
          .filter(city => 
            city.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map(city => ({
            name: city,
            country: 'MX',
            lat: 0,
            lon: 0
          }));
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      }
    } finally {
      setLoading(false);
    }
  }, []); // Sin dependencias porque no usa props o state

  // Debounce para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        searchCities(query);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, searchCities]); // ✅ Ahora incluye searchCities

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setSelectedIndex(-1);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: CitySuggestion) => {
    onSearch(suggestion.name);
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleFocus = () => {
    if (query.length === 0 && recentCities.length > 0) {
      // Mostrar ciudades recientes
      const recentSuggestions = recentCities.map(city => ({
        name: city,
        country: 'MX',
        lat: 0,
        lon: 0
      }));
      setSuggestions(recentSuggestions);
      setShowSuggestions(true);
    } else if (query.length > 0) {
      setShowSuggestions(suggestions.length > 0);
    }
  };

  const formatCityDisplay = (suggestion: CitySuggestion) => {
    if (suggestion.state) {
      return `${suggestion.name}, ${suggestion.state}`;
    }
    return suggestion.name;
  };

  const isRecent = (cityName: string) => 
    recentCities.some(city => city.toLowerCase() === cityName.toLowerCase());

  return (
    <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
      <Box sx={{ position: 'relative' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Paper
            elevation={1}
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: { xs: 150, sm: 250, md: 300 },
              borderRadius: '20px',
              transition: 'width 0.3s',
            }}
          >
            <InputBase
              ref={inputRef}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Buscar ciudad..."
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              inputProps={{ 
                'aria-label': 'buscar ciudad',
                'aria-autocomplete': 'list',
                'aria-controls': 'search-suggestions',
                'aria-expanded': showSuggestions
              }}
            />
            {loading ? (
              <CircularProgress size={20} sx={{ mx: 1.5 }} />
            ) : (
              <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <SearchIcon />
              </IconButton>
            )}
          </Paper>
        </Box>

        {/* Lista de sugerencias */}
        {showSuggestions && suggestions.length > 0 && (
          <Paper
            id="search-suggestions"
            elevation={3}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0.5,
              zIndex: 1000,
              maxHeight: 300,
              overflow: 'auto',
              borderRadius: '12px',
            }}
          >
            {query.length === 0 && recentCities.length > 0 && (
              <>
                <Box sx={{ px: 2, py: 1, backgroundColor: 'action.hover' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight="medium">
                    Búsquedas recientes
                  </Typography>
                </Box>
                <Divider />
              </>
            )}
            
            <List disablePadding>
              {suggestions.map((suggestion, index) => (
                <ListItemButton
                  key={`${suggestion.name}-${suggestion.lat}-${suggestion.lon}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  selected={selectedIndex === index}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {isRecent(suggestion.name) ? (
                      <HistoryIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    ) : query.length === 0 ? (
                      <TrendingUpIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                    ) : (
                      <LocationOnIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText 
                    primary={formatCityDisplay(suggestion)}
                    secondary={suggestion.country === 'MX' ? 'México' : suggestion.country}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: isRecent(suggestion.name) ? 500 : 400
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption'
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}

        {/* Mensaje cuando no hay resultados */}
        {showSuggestions && !loading && suggestions.length === 0 && query.trim().length > 1 && (
          <Paper
            elevation={3}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              mt: 0.5,
              zIndex: 1000,
              borderRadius: '12px',
            }}
          >
            <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
              <LocationOnIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                No se encontraron ciudades
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Intenta con otro nombre
              </Typography>
            </Box> 
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default SearchBar;