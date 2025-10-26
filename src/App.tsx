import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom'; // 1. Importamos los componentes de enrutamiento
import { ThemeProvider as MuiThemeProvider, CssBaseline, Box } from '@mui/material';

import { ThemeContext } from './contexts/ThemeContext';
import { lightTheme, darkTheme } from './services/theme';
import { useWeatherData } from './hooks/useWeatherData';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage'; 
import MapPage from './pages/MapPage';

function App() {
  const { theme } = useContext(ThemeContext);
  const muiTheme = theme === 'light' ? lightTheme : darkTheme;
  
  const weatherHookData = useWeatherData();

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        <Header 
          onSearch={weatherHookData.addCity} 
          cities={weatherHookData.cities}
          weatherDataMap={weatherHookData.data}
        />

        <Box component="main" sx={{ flexGrow: 1, py: 1, px:  0}}>
          <Routes>
            <Route 
              path="/" 
              element={<DashboardPage weatherHook={weatherHookData} />} 
            />
            <Route 
              path="/settings" 
              element={<SettingsPage weatherHook={weatherHookData} />} 
            />
            <Route
              path="/map"
              element={<MapPage weatherHook={weatherHookData} />}
            />
          </Routes>
        </Box>
        
        <Footer />
      </Box>
    </MuiThemeProvider>
  );
}

export default App;