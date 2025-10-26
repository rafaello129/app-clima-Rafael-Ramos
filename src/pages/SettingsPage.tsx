import React, { useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  Stack,

  alpha,
  useTheme,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
} from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import SettingsIcon from '@mui/icons-material/Settings';
import StorageIcon from '@mui/icons-material/Storage';
import InfoIcon from '@mui/icons-material/Info';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocationCityIcon from '@mui/icons-material/LocationCity';

import { useWeatherData } from '../hooks/useWeatherData';

interface SettingsPageProps {
  weatherHook: ReturnType<typeof useWeatherData>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ weatherHook }) => {
  const theme = useTheme();
  const { clearAllCities, cities } = weatherHook;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  

  const handleClearData = () => {
    clearAllCities();
    setOpenDeleteDialog(false);
  };

  // Calcular tamaño de datos en localStorage
  const getStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return (total / 1024).toFixed(2); // KB
  };

  const SettingCard = ({ 
    icon, 
    title, 
    description, 
    children 
  }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    children: React.ReactNode 
  }) => (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main || '#1976d2', 0.1)}`,
          borderColor: alpha(theme.palette.primary.main || '#1976d2', 0.3),
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha('#667eea', 0.1)} 0%, ${alpha('#764ba2', 0.1)} 100%)`,
            color: '#667eea',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box flex={1}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {description}
          </Typography>
          {children}
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: `0 8px 16px ${alpha('#667eea', 0.3)}`,
            }}
          >
            <SettingsIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              fontWeight={700}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Configuración
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Personaliza tu experiencia con la app
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Stack spacing={3}>
    

        {/* Notificaciones */}

        {/* Almacenamiento */}
        <SettingCard
          icon={<StorageIcon />}
          title="Almacenamiento"
          description="Información sobre el uso de almacenamiento local"
        >
          <List disablePadding>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LocationCityIcon sx={{ color: '#667eea' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontWeight={600}>
                      Ciudades guardadas
                    </Typography>
                    <Badge 
                      badgeContent={cities.length} 
                      color="primary"
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.65rem',
                          height: 18,
                          minWidth: 18,
                        },
                      }}
                    />
                  </Box>
                }
                secondary={`${cities.length} ${cities.length === 1 ? 'ciudad' : 'ciudades'} en total`}
              />
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <StorageIcon sx={{ color: '#764ba2' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={600}>
                    Espacio utilizado
                  </Typography>
                }
                secondary={`${getStorageSize()} KB de datos locales`}
              />
            </ListItem>
          </List>
        </SettingCard>

        {/* Zona de peligro */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `2px solid ${alpha('#ef5350', 0.2)}`,
            bgcolor: alpha('#ef5350', 0.03),
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha('#ef5350', 0.1),
                color: '#ef5350',
                flexShrink: 0,
              }}
            >
              <WarningAmberIcon />
            </Box>
            <Box flex={1}>
              <Typography variant="h6" fontWeight={700} gutterBottom color="error">
                Zona de peligro
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Las acciones en esta sección son permanentes.
              </Typography>

              <Alert 
                severity="error" 
                icon={<InfoIcon />}
                sx={{ mb: 2 }}
              >
                Esta acción eliminará <strong>todas las ciudades guardadas</strong> y sus datos asociados de forma permanente.
              </Alert>

              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={() => setOpenDeleteDialog(true)}
                disabled={cities.length === 0}
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                Eliminar todas las ciudades ({cities.length})
              </Button>

              {cities.length === 0 && (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1, textAlign: 'center' }}>
                  No hay ciudades para eliminar
                </Typography>
              )}
            </Box>
          </Stack>
        </Paper>


      </Stack>

      {/* Dialog de confirmación */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: alpha('#ef5350', 0.1),
                color: '#ef5350',
              }}
            >
              <WarningAmberIcon />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              ¿Eliminar todas las ciudades?
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Estás a punto de eliminar <strong>{cities.length} {cities.length === 1 ? 'ciudad' : 'ciudades'}</strong> guardadas 
            y todos sus datos asociados.
          </DialogContentText>
          <Alert severity="warning" icon={<InfoIcon />} sx={{ mt: 2 }}>
            Esta acción es <strong>permanente</strong> y no se puede deshacer.
          </Alert>
          
          {cities.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary" gutterBottom display="block">
                Ciudades que se eliminarán:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 1 }}>
                {cities.slice(0, 5).map((city) => (
                  <Chip 
                    key={city} 
                    label={city} 
                    size="small" 
                    sx={{ fontSize: '0.7rem' }}
                  />
                ))}
                {cities.length > 5 && (
                  <Chip 
                    label={`+${cities.length - 5} más`} 
                    size="small" 
                    sx={{ fontSize: '0.7rem' }}
                  />
                )}
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleClearData} 
            color="error" 
            variant="contained"
            startIcon={<DeleteSweepIcon />}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            Eliminar todo
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SettingsPage;