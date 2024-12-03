import React, { useState } from 'react';
import { 
  Paper, 
  Autocomplete,
  TextField, 
  Button, 
  Stack,
  IconButton,
  Tooltip,
  Box,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Camera as CameraIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

const DetectionSettings = ({
  targetObject,
  onObjectChange,
  timeout,
  onTimeoutChange,
  onStart,
  onReset,
  disabled
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  // הגדרת האובייקטים לזיהוי
  const DETECTABLE_OBJECTS = {
    'person': 'אדם',
    'bicycle': 'אופניים',
    'car': 'מכונית',
    'motorcycle': 'אופנוע',
    'airplane': 'מטוס',
    'bus': 'אוטובוס',
    'train': 'רכבת',
    'truck': 'משאית',
    'boat': 'סירה',
    'cat': 'חתול',
    'dog': 'כלב',
    'chair': 'כיסא',
    'couch': 'ספה',
    'potted plant': 'עציץ',
    'bed': 'מיטה',
    'dining table': 'שולחן אוכל',
    'toilet': 'שירותים',
    'tv': 'טלוויזיה',
    'laptop': 'מחשב נייד',
    'mouse': 'עכבר',
    'remote': 'שלט',
    'keyboard': 'מקלדת',
    'cell phone': 'טלפון נייד',
    'book': 'ספר',
    'clock': 'שעון',
    'vase': 'אגרטל',
    'scissors': 'מספריים',
    'teddy bear': 'דובי',
    'toothbrush': 'מברשת שיניים'
  };

  return (
    <Box className={`controls-wrapper ${isMinimized ? 'minimized' : ''}`}>
      <div 
        className="drag-handle"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <IconButton size="small">
          {isMinimized ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </IconButton>
      </div>

      <Paper 
        elevation={3}
        sx={{ 
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px 20px 0 0',
          transition: 'transform 0.3s ease'
        }}
      >
        <Stack spacing={2}>
          <Autocomplete
            value={targetObject}
            onChange={(event, newValue) => onObjectChange(newValue)}
            options={Object.keys(DETECTABLE_OBJECTS)}
            getOptionLabel={(option) => 
              option ? `${DETECTABLE_OBJECTS[option]} (${option})` : ''
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="בחר אובייקט לזיהוי"
                variant="outlined"
                disabled={disabled}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: <SearchIcon color="primary" />
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      backgroundColor: '#ffffff'
                    }
                  }
                }}
              />
            )}
            disabled={disabled}
            sx={{ width: '100%' }}
          />
          
          <TextField
            label="משך זמן לזיהוי (שניות)"
            type="number"
            value={timeout}
            onChange={(e) => onTimeoutChange(Number(e.target.value))}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TimerIcon color="primary" />
                </InputAdornment>
              ),
              inputProps: { min: 1, max: 300 }
            }}
            disabled={disabled}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': {
                  backgroundColor: '#ffffff'
                }
              }
            }}
          />
          
          <Stack 
            direction="row" 
            spacing={2}
            sx={{ justifyContent: 'center' }}
          >
            <Button
              variant="contained"
              onClick={onStart}
              disabled={disabled || !targetObject}
              startIcon={<CameraIcon />}
              sx={{
                borderRadius: '12px',
                padding: '10px 24px',
                backgroundColor: '#2196f3',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#1976d2'
                },
                '&:disabled': {
                  backgroundColor: '#e0e0e0',
                  color: '#9e9e9e'
                }
              }}
            >
              התחל זיהוי
            </Button>
            
            <Tooltip title="איפוס">
              <IconButton
                onClick={onReset}
                disabled={!disabled}
                sx={{
                  backgroundColor: '#f5f5f5',
                  color: '#2c3e50',
                  '&:hover': {
                    backgroundColor: '#e0e0e0'
                  },
                  '&:disabled': {
                    color: '#9e9e9e'
                  }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default DetectionSettings; 