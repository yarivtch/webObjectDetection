import React from 'react';
import { 
  Paper, 
  Autocomplete,
  TextField, 
  Button, 
  Stack,
  IconButton,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Camera as CameraIcon,
  Timer as TimerIcon
} from '@mui/icons-material';

const DETECTABLE_OBJECTS = {
  // אנשים
  'person': 'אדם',
  
  // חיות
  'bird': 'ציפור',
  'cat': 'חתול',
  'dog': 'כלב',
  'horse': 'סוס',
  'sheep': 'כבשה',
  'cow': 'פרה',
  'elephant': 'פיל',
  'bear': 'דוב',
  'zebra': 'זברה',
  'giraffe': 'ג׳ירפה',

  // כלי תחבורה
  'bicycle': 'אופניים',
  'car': 'מכונית',
  'motorcycle': 'אופנוע',
  'airplane': 'מטוס',
  'bus': 'אוטובוס',
  'train': 'רכבת',
  'truck': 'משאית',
  'boat': 'סירה',

  // חפצים ביתיים
  'chair': 'כיסא',
  'couch': 'ספה',
  'bed': 'מיטה',
  'dining table': 'שולחן אוכל',
  'toilet': 'שירותים',
  'tv': 'טלוויזיה',
  'laptop': 'מחשב נייד',
  'mouse': 'עכבר',
  'remote': 'שלט',
  'keyboard': 'מקלדת',
  'cell phone': 'טלפון נייד',
  'microwave': 'מיקרוגל',
  'oven': 'תנור',
  'toaster': 'טוסטר',
  'sink': 'כיור',
  'refrigerator': 'מקרר',
  'book': 'ספר',
  'clock': 'שעון',
  'vase': 'אגרטל',
  'scissors': 'מספריים',
  'teddy bear': 'דובי',
  'hair drier': 'מייבש שיער',
  'toothbrush': 'מברשת שיניים',

  // כלי מטבח
  'bottle': 'בקבוק',
  'cup': 'כוס',
  'fork': 'מזלג',
  'knife': 'סכין',
  'spoon': 'כף',
  'bowl': 'קערה',

  // מזון
  'banana': 'בננה',
  'apple': 'תפוח',
  'sandwich': 'כריך',
  'orange': 'תפוז',
  'broccoli': 'ברוקולי',
  'carrot': 'גזר',
  'hot dog': 'נקניקיה',
  'pizza': 'פיצה',
  'donut': 'דונאט',
  'cake': 'עוגה',

  // ספורט
  'frisbee': 'פריזבי',
  'skis': 'מגלשיים',
  'snowboard': 'סנובורד',
  'sports ball': 'כדור ספורט',
  'kite': 'עפיפון',
  'baseball bat': 'מחבט בייסבול',
  'baseball glove': 'כפפת בייסבול',
  'skateboard': 'סקייטבורד',
  'surfboard': 'גלשן',
  'tennis racket': 'מחבט טניס',

  // אביזרי לבוש
  'backpack': 'תיק גב',
  'umbrella': 'מטריה',
  'handbag': 'תיק יד',
  'tie': 'עניבה',
  'suitcase': 'מזוודה',

  // תחבורה ציבורית
  'traffic light': 'רמזור',
  'fire hydrant': 'ברז כיבוי אש',
  'stop sign': 'תמרור עצור',
  'parking meter': 'מד חניה',
  'bench': 'ספסל'
};

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
    <Paper 
      elevation={3}
      sx={{ 
        p: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px 20px 0 0'
      }}
    >
      <Stack spacing={2}>
        <Autocomplete
          value={targetObject}
          onChange={(event, newValue) => onObjectChange(newValue)}
          options={Object.keys(DETECTABLE_OBJECTS)}
          getOptionLabel={(option) => `${DETECTABLE_OBJECTS[option]} (${option})`}
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
  );
};

export default DetectionSettings; 