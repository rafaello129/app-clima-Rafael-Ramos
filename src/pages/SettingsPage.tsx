import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Box,
  Divider,
  Alert
} from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

import { useWeatherData } from '../hooks/useWeatherData';

interface SettingsPageProps {
  weatherHook: ReturnType<typeof useWeatherData>;
}


const SettingsPage: React.FC<SettingsPageProps> = ({ weatherHook }) => {
  const { clearAllCities } = weatherHook;

  const handleClearData = () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todas las ciudades guardadas? Esta acción no se puede deshacer.')) {
      clearAllCities();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Configuración
        </Typography>
        <Card>
          <CardHeader
            title="Gestión de Datos"
            subheader="Opciones para administrar los datos de la aplicación"
          />
          <CardContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Las acciones en esta sección son destructivas. Procede con cuidado.
            </Alert>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1">
                Eliminar todas las ciudades
              </Typography>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={handleClearData}
              >
                Eliminar
              </Button>
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              Esto borrará tu lista de ciudades del almacenamiento local.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default SettingsPage;