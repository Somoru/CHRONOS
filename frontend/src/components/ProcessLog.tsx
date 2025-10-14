'use client';

import {
  Paper,
  Typography,
  Box,
  Stack,
  CircularProgress,
  alpha,
  Fade,
} from '@mui/material';
import { Terminal as TerminalIcon } from '@mui/icons-material';
import { useEffect, useRef } from 'react';

interface ProcessLogProps {
  logs: string[];
  isLoading: boolean;
}

export default function ProcessLog({ logs, isLoading }: ProcessLogProps) {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        background: (theme) =>
          theme.palette.mode === 'light'
            ? 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)'
            : 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
        border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TerminalIcon color="primary" />
        <Typography variant="h6" fontWeight={600}>
          Process Log
        </Typography>
        {isLoading && (
          <Fade in>
            <CircularProgress size={20} thickness={5} />
          </Fade>
        )}
      </Stack>

      <Box
        ref={logContainerRef}
        sx={{
          height: 280,
          overflowY: 'auto',
          bgcolor: (theme) =>
            theme.palette.mode === 'light' ? '#f8f9fa' : '#0d1117',
          borderRadius: 2,
          p: 2,
          fontFamily: '"Fira Code", "Consolas", monospace',
          fontSize: '0.875rem',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: (theme) => alpha(theme.palette.primary.main, 0.3),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: (theme) => alpha(theme.palette.primary.main, 0.5),
          },
        }}
      >
        <Stack spacing={1.5}>
          {logs.map((log, index) => (
            <Fade in key={index} timeout={300}>
              <Box
                sx={{
                  color: log.includes('❌')
                    ? 'error.main'
                    : log.includes('✅')
                    ? 'success.main'
                    : log.includes('🚀') || log.includes('🤖')
                    ? 'primary.main'
                    : 'text.primary',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  py: 0.5,
                  px: 1,
                  borderRadius: 1,
                  bgcolor: (theme) =>
                    log.includes('❌')
                      ? alpha(theme.palette.error.main, 0.1)
                      : log.includes('✅')
                      ? alpha(theme.palette.success.main, 0.1)
                      : 'transparent',
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: '0.75rem',
                    opacity: 0.6,
                    minWidth: '50px',
                  }}
                >
                  [{new Date().toLocaleTimeString()}]
                </Typography>
                <Typography component="span" sx={{ flex: 1 }}>
                  {log}
                </Typography>
              </Box>
            </Fade>
          ))}
          {logs.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ py: 4 }}
            >
              Waiting for process to start...
            </Typography>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
