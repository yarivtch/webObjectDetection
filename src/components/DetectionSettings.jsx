import React from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem 
} from '@mui/material';

const DetectionSettings = ({
  targetObject,
  onObjectChange,
  timeout,
  onTimeoutChange,
  onStart,
  onReset,
  disabled
}) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <TextField
          label="אובייקט לזיהוי"
          value={targetObject}
          onChange={(e) => onObjectChange(e.target.value)}
          disabled={disabled}
          fullWidth
        />
        
        <FormControl fullWidth>
          <InputLabel>זמן חיפוש (שניות)</InputLabel>
          <Select
            value={timeout}
            onChange={(e) => onTimeoutChange(e.target.value)}
            disabled={disabled}
          >
            <MenuItem value={10}>10 שניות</MenuItem>
            <MenuItem value={30}>30 שניות</MenuItem>
            <MenuItem value={60}>דקה</MenuItem>
            <MenuItem value={120}>2 דקות</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2}>
          <Button 
            variant="contained" 
            onClick={onStart}
            disabled={disabled || !targetObject}
            fullWidth
          >
            התחל זיהוי
          </Button>
          <Button 
            variant="outlined" 
            onClick={onReset}
            disabled={!disabled}
            fullWidth
          >
            איפוס
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default DetectionSettings; 