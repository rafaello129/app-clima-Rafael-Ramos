import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  alpha, 
  useTheme,
  Chip,
  Stack,
  useMediaQuery
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { ForecastData } from '../../api/types';
import { formatDayOfWeek, formatTime } from '../../utils/formatters';

interface ForecastProps {
  forecast: ForecastData;
}

const groupForecastByDay = (list: ForecastData['list']) => {
  const grouped: { [key: string]: { temps: number[], icons: string[], descriptions: string[] } } = {};

  list.forEach(item => {
    const day = item.dt_txt.split(' ')[0]; 
    if (!grouped[day]) {
      grouped[day] = { temps: [], icons: [], descriptions: [] };
    }
    grouped[day].temps.push(item.main.temp);
    grouped[day].icons.push(item.weather[0].icon);
    grouped[day].descriptions.push(item.weather[0].description);
  });

  return Object.entries(grouped).map(([day, data]) => {
    const midDayIcon = data.icons[Math.floor(data.icons.length / 2)] || data.icons[0];
    const midDayDescription = data.descriptions[Math.floor(data.descriptions.length / 2)] || data.descriptions[0];
    return {
      dt_txt: day,
      dt: new Date(day).getTime() / 1000,
      temp_max: Math.max(...data.temps),
      temp_min: Math.min(...data.temps),
      icon: midDayIcon,
      description: midDayDescription,
    };
  });
};

const Forecast: React.FC<ForecastProps> = ({ forecast }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { list, city } = forecast;
  
  const next24Hours = list.slice(0, isMobile ? 6 : 8);
  const dailyForecast = groupForecastByDay(list);

  return (
    <Box sx={{ mt: 2 }}>
      {/* Pronóstico por Horas */}
      <Box sx={{ mb: { xs: 3, sm: 4 } }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 1.5 }, 
            mb: { xs: 1.5, sm: 2.5 },
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 28, sm: 32 },
              height: { xs: 28, sm: 32 },
              borderRadius: '8px',
              bgcolor: alpha('#0288d1', 0.1),
              color: '#0288d1',
            }}
          >
            <AccessTimeIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
          </Box>
          <Typography 
            variant="h6" 
            fontWeight={700}
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Pronóstico por Horas
          </Typography>
          <Chip 
            label="24h" 
            size="small" 
            sx={{ 
              height: { xs: 20, sm: 22 },
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              fontWeight: 600,
              bgcolor: alpha('#0288d1', 0.1),
              color: '#0288d1',
            }} 
          />
        </Box>

        <Box 
          sx={{ 
            display: 'flex',
            gap: { xs: 1.5, sm: 2 },
            overflowX: 'auto',
            pb: 2,
            px: { xs: 0.5, sm: 0 },
            mx: { xs: -0.5, sm: 0 },
            '&::-webkit-scrollbar': {
              height: { xs: 6, sm: 8 },
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: alpha(theme.palette.divider, 0.1),
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: alpha('#1976d2', 0.3),
              borderRadius: 4,
              '&:hover': {
                bgcolor: alpha('#1976d2', 0.5),
              },
            },
          }}
        >
          {next24Hours.map((hour, index) => {
            const isNow = index === 0;
            return (
              <Paper 
                key={hour.dt}
                elevation={0}
                sx={{
                  minWidth: { xs: 80, sm: 100 },
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  border: `2px solid ${isNow ? '#1976d2' : alpha(theme.palette.divider, 0.1)}`,
                  bgcolor: isNow 
                    ? alpha('#1976d2', 0.08)
                    : alpha(theme.palette.background.paper, 0.6),
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  '&:hover': {
                    transform: { xs: 'scale(1.02)', sm: 'translateY(-4px)' },
                    boxShadow: `0 8px 16px ${alpha('#1976d2', 0.15)}`,
                    borderColor: '#1976d2',
                  },
                }}
              >
                {isNow && (
                  <Chip 
                    label="Ahora" 
                    size="small"
                    sx={{ 
                      position: 'absolute',
                      top: { xs: -8, sm: -10 },
                      left: '50%',
                      transform: 'translateX(-50%)',
                      height: { xs: 18, sm: 20 },
                      fontSize: { xs: '0.6rem', sm: '0.65rem' },
                      fontWeight: 700,
                      bgcolor: '#1976d2',
                      color: 'white',
                    }}
                  />
                )}
                
                <Typography 
                  variant="caption" 
                  color={isNow ? 'primary' : 'text.secondary'}
                  sx={{ 
                    fontWeight: isNow ? 700 : 500,
                    display: 'block',
                    mb: 1,
                    fontSize: { xs: '0.65rem', sm: '0.75rem' },
                  }}
                >
                  {formatTime(hour.dt, city.timezone)}
                </Typography>
                
                <Box sx={{ my: 1 }}>
                  <img 
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    alt={hour.weather[0].description}
                    style={{ 
                      width: isMobile ? 40 : 50, 
                      height: isMobile ? 40 : 50,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="h6" 
                  fontWeight={700}
                  sx={{ 
                    fontSize: { xs: '1rem', sm: '1.25rem' },
                    color: isNow ? 'primary.main' : 'text.primary',
                  }}
                >
                  {Math.round(hour.main.temp)}°
                </Typography>
                
                {!isMobile && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ 
                      display: 'block',
                      mt: 0.5,
                      fontSize: '0.7rem',
                    }}
                  >
                    {hour.weather[0].description}
                  </Typography>
                )}
              </Paper>
            );
          })}
        </Box>
      </Box>

      <Divider sx={{ my: { xs: 3, sm: 4 } }} />

      {/* Pronóstico Semanal */}
      <Box>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 1, sm: 1.5 }, 
            mb: { xs: 1.5, sm: 2.5 },
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: { xs: 28, sm: 32 },
              height: { xs: 28, sm: 32 },
              borderRadius: '8px',
              bgcolor: alpha('#9c27b0', 0.1),
              color: '#9c27b0',
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
          </Box>
          <Typography 
            variant="h6" 
            fontWeight={700}
            sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Pronóstico Semanal
          </Typography>
          <Chip 
            label={`${dailyForecast.length} días`}
            size="small" 
            sx={{ 
              height: { xs: 20, sm: 22 },
              fontSize: { xs: '0.65rem', sm: '0.7rem' },
              fontWeight: 600,
              bgcolor: alpha('#9c27b0', 0.1),
              color: '#9c27b0',
            }} 
          />
        </Box>

        <Stack spacing={{ xs: 1, sm: 1.5 }}>
          {dailyForecast.map((day, index) => {
            const isToday = index === 0;
            return (
              <Paper
                key={day.dt}
                elevation={0}
                sx={{
                  p: { xs: 1.5, sm: 2.5 },
                  borderRadius: { xs: 2, sm: 3 },
                  display: 'flex',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 2 },
                  transition: 'all 0.3s ease',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  bgcolor: isToday 
                    ? alpha('#9c27b0', 0.05)
                    : alpha(theme.palette.background.paper, 0.6),
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    transform: { xs: 'scale(1.01)', sm: 'translateX(8px)' },
                    boxShadow: `0 4px 12px ${alpha('#9c27b0', 0.12)}`,
                    borderColor: alpha('#9c27b0', 0.3),
                  },
                }}
              >
                {/* Día */}
                <Box sx={{ minWidth: { xs: 70, sm: 100 } }}>
                  <Typography 
                    variant="body1" 
                    fontWeight={isToday ? 700 : 600}
                    color={isToday ? 'primary' : 'text.primary'}
                    sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}
                  >
                    {isMobile 
                      ? formatDayOfWeek(day.dt, city.timezone).substring(0, 3)
                      : formatDayOfWeek(day.dt, city.timezone)
                    }
                  </Typography>
                  {isToday && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#9c27b0',
                        fontWeight: 600,
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      }}
                    >
                      Hoy
                    </Typography>
                  )}
                </Box>

                {/* Ícono y descripción */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 0.5, sm: 1.5 },
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <img 
                    src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    alt={day.description}
                    style={{ 
                      width: isMobile ? 36 : 48, 
                      height: isMobile ? 36 : 48,
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                      flexShrink: 0,
                    }}
                  />
                  {!isMobile && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        textTransform: 'capitalize',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {day.description}
                    </Typography>
                  )}
                </Box>

                {/* Temperaturas */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: { xs: 1.5, sm: 3 },
                    flexShrink: 0,
                  }}
                >
                  {/* Máxima */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      minWidth: { xs: 45, sm: 60 },
                    }}
                  >
                    <ArrowUpwardIcon 
                      sx={{ 
                        fontSize: { xs: 14, sm: 16 }, 
                        color: '#d32f2f',
                      }} 
                    />
                    <Typography 
                      variant="body1" 
                      fontWeight={700}
                      sx={{ 
                        color: '#d32f2f',
                        fontSize: { xs: '0.9rem', sm: '1rem' },
                      }}
                    >
                      {Math.round(day.temp_max)}°
                    </Typography>
                  </Box>

                  {/* Mínima */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      minWidth: { xs: 45, sm: 60 },
                    }}
                  >
                    <ArrowDownwardIcon 
                      sx={{ 
                        fontSize: { xs: 14, sm: 16 }, 
                        color: '#1976d2',
                      }} 
                    />
                    <Typography 
                      variant="body1" 
                      fontWeight={600}
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
                    >
                      {Math.round(day.temp_min)}°
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
};

export default Forecast;