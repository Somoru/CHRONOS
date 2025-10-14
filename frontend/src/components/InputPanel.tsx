'use client';

import { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Stack,
  Box,
  Divider,
  Chip,
  Tooltip,
  alpha,
} from '@mui/material';
import {
  Send as SendIcon,
  AutoAwesome as AutoAwesomeIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

interface InputPanelProps {
  onSubmit: (fragment: string, options: any) => void;
  isLoading: boolean;
}

export default function InputPanel({ onSubmit, isLoading }: InputPanelProps) {
  const [fragment, setFragment] = useState('');
  const [eraDetection, setEraDetection] = useState(true);
  const [maxSources, setMaxSources] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fragment.trim()) {
      onSubmit(fragment, {
        era_detection: eraDetection,
        max_sources: maxSources,
      });
    }
  };

  const examples = [
    { text: 'The quick brown fox jumps over the lazy...', label: 'Classic' },
    { text: 'To be or not to be, that is the...', label: 'Shakespeare' },
    { text: 'In a hole in the ground there lived a...', label: 'Tolkien' },
    { text: 'It was the best of times, it was the...', label: 'Dickens' }
  ];

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        height: '100%',
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)'
            : 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <AutoAwesomeIcon color="primary" />
        <Typography variant="h5" fontWeight={600}>
          Input Fragment
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Enter incomplete text for AI-powered reconstruction
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            multiline
            rows={7}
            fullWidth
            variant="outlined"
            placeholder="Enter your incomplete text fragment here... 
            
Example: 'The quick brown fox jumps over the...'"
            value={fragment}
            onChange={(e) => setFragment(e.target.value)}
            disabled={isLoading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />

          <Box>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              💡 Quick Examples
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {examples.map((example, idx) => (
                <Tooltip key={idx} title={example.label} arrow>
                  <Chip
                    label={example.text}
                    onClick={() => setFragment(example.text)}
                    sx={{
                      mb: 1,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                      transition: 'all 0.2s',
                    }}
                    disabled={isLoading}
                    color="primary"
                    variant="outlined"
                  />
                </Tooltip>
              ))}
            </Stack>
          </Box>

          <Divider>
            <Chip
              icon={<SettingsIcon />}
              label="Options"
              size="small"
              color="primary"
              variant="outlined"
            />
          </Divider>

          <Box>
            <Stack spacing={2.5}>
              <Tooltip title="Enable AI-powered time period detection" arrow placement="right">
                <FormControlLabel
                  control={
                    <Switch
                      checked={eraDetection}
                      onChange={(e) => setEraDetection(e.target.checked)}
                      disabled={isLoading}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2" fontWeight={500}>
                      ⏰ Era Detection
                    </Typography>
                  }
                />
              </Tooltip>
              
              <Box>
                <Typography variant="body2" gutterBottom fontWeight={500}>
                  📚 Max Sources: <strong>{maxSources}</strong>
                </Typography>
                <Stack direction="row" spacing={1}>
                  {[3, 5, 10].map((num) => (
                    <Button
                      key={num}
                      size="small"
                      variant={maxSources === num ? 'contained' : 'outlined'}
                      onClick={() => setMaxSources(num)}
                      disabled={isLoading}
                      sx={{
                        minWidth: 60,
                        fontWeight: 600,
                      }}
                    >
                      {num}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={isLoading || !fragment.trim()}
            endIcon={<SendIcon />}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s',
            }}
          >
            {isLoading ? 'Processing...' : 'Reconstruct Text'}
          </Button>

          {fragment.trim() && (
            <Typography variant="caption" color="text.secondary" textAlign="center">
              {fragment.trim().split(' ').length} words • Ready to process
            </Typography>
          )}
        </Stack>
      </form>
    </Paper>
  );
}
