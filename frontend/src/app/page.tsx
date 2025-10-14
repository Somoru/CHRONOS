'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Stack,
  IconButton,
  Fade,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Science,
} from '@mui/icons-material';
import InputPanel from '@/components/InputPanel';
import ReportCard from '@/components/ReportCard';
import ProcessLog from '@/components/ProcessLog';
import { ReconstructionReport } from '@/types/api';
import { useThemeMode } from './ThemeProvider';

export default function Home() {
  const [report, setReport] = useState<ReconstructionReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processLog, setProcessLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { mode, toggleTheme } = useThemeMode();

  const handleReconstruct = async (fragment: string, options: any) => {
    setIsLoading(true);
    setReport(null);
    setProcessLog([]);
    setError(null);

    const logStream: string[] = [];
    const log = (message: string) => {
      logStream.push(message);
      setProcessLog([...logStream]);
    };

    try {
      log('🚀 Initializing Chronos AI...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      log('🔍 Analyzing text fragment...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      log('🤖 Connecting to Gemini AI...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      log('📚 Searching historical archives...');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (options.era_detection) {
        log('⏰ Detecting time period...');
        await new Promise(resolve => setTimeout(resolve, 600));
      }

      log('📡 Sending request to backend...');
      
      const response = await fetch('http://localhost:8000/api/reconstruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fragment, options }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || `API Error: ${response.statusText}`);
      }

      const result: ReconstructionReport = await response.json();
      setReport(result);
      log('✅ Reconstruction complete!');
    } catch (error: any) {
      console.error('Error:', error);
      const errorMsg = error.message || 'Unknown error occurred';
      log(`❌ Error: ${errorMsg}`);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: mode === 'light'
          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Science sx={{ fontSize: 48, color: 'primary.light' }} />
              <Typography
                variant="h2"
                component="h1"
                fontWeight={700}
                sx={{
                  background: mode === 'light'
                    ? 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)'
                    : 'linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Project Chronos
              </Typography>
            </Stack>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              AI-Powered Text Fragment Reconstruction
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Leverage advanced AI and semantic search to reconstruct incomplete text fragments
              with contextual understanding and historical accuracy.
            </Typography>
            
            {/* Theme Toggle */}
            <Box sx={{ position: 'absolute', top: 24, right: 24 }}>
              <IconButton
                onClick={toggleTheme}
                color="primary"
                sx={{
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                  '&:hover': { boxShadow: 4 },
                }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          </Box>
        </Fade>

        {/* Main Content */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Fade in timeout={1000}>
            <Box sx={{ flex: { xs: 1, md: '0 0 400px' } }}>
              <InputPanel onSubmit={handleReconstruct} isLoading={isLoading} />
            </Box>
          </Fade>

          <Fade in timeout={1200}>
            <Box sx={{ flex: 1 }}>
              <Stack spacing={3}>
                {(isLoading || processLog.length > 0) && (
                  <ProcessLog logs={processLog} isLoading={isLoading} />
                )}
                {report && <ReportCard report={report} />}
                
                {!isLoading && !report && processLog.length === 0 && (
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 8,
                      bgcolor: 'background.paper',
                      borderRadius: 3,
                      boxShadow: 2,
                    }}
                  >
                    <Science sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Ready to Reconstruct
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Enter a text fragment to begin AI-powered reconstruction
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          </Fade>
        </Stack>

        {/* Footer */}
        <Fade in timeout={1400}>
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Project Chronos v1.1 • Powered by Gemini AI & pgvector
            </Typography>
          </Box>
        </Fade>
      </Container>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)} sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
