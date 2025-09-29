import { Alert, AlertTitle, Button, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}


const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <Alert
      severity="error"
      icon={<ErrorOutlineIcon fontSize="inherit" />}
      variant="outlined"
      sx={{
        my: 2, 
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box>
        <AlertTitle>Error</AlertTitle>
        {message}
      </Box>
      {onRetry && (
        <Button
          color="error"
          variant="outlined"
          onClick={onRetry}
          sx={{ ml: 'auto', whiteSpace: 'nowrap' }}
        >
          Reintentar
        </Button>
      )}
    </Alert>
  );
};

export default ErrorMessage;