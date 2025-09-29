
export const formatTime = (timestamp: number, timezoneOffset: number): string => {

    const date = new Date((timestamp + timezoneOffset) * 1000);
    
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC',
      hour12: false,
    }).format(date);
  };
  

  export const formatDayOfWeek = (timestamp: number, timezoneOffset: number): string => {
    const date = new Date((timestamp + timezoneOffset) * 1000);
    
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      timeZone: 'UTC', 
    }).format(date);
  };
  

  export const capitalizeDescription = (description: string): string => {
    if (!description) return '';
    return description
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  

  export const getAqiText = (aqi: 1 | 2 | 3 | 4 | 5): { text: string; color: string } => {
    switch (aqi) {
      case 1:
        return { text: 'Bueno', color: 'success.main' };
      case 2:
        return { text: 'Aceptable', color: 'success.light' };
      case 3:
        return { text: 'Moderado', color: 'warning.main' };
      case 4:
        return { text: 'Malo', color: 'error.main' };
      case 5:
        return { text: 'Muy Malo', color: 'error.dark' };
      default:
        return { text: 'Desconocido', color: 'text.secondary' };
    }
  };
  

  export const formatTemperature = (temp: number): string => {
    return `${Math.round(temp)}°`;
  };