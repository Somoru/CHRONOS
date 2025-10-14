'use client';

import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
  LinearProgress,
  Divider,
  Link,
  alpha,
  Fade,
  Card,
  CardContent,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  Label as LabelIcon,
  Description as DescriptionIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { ReconstructionReport } from '@/types/api';

interface ReportCardProps {
  report: ReconstructionReport;
}

export default function ReportCard({ report }: ReportCardProps) {
  return (
    <Fade in timeout={600}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(145deg, #ffffff 0%, #f5f7fa 100%)'
              : 'linear-gradient(145deg, #1e1e1e 0%, #2d2d2d 100%)',
          border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <CheckCircleIcon color="success" sx={{ fontSize: 36 }} />
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Reconstruction Complete
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI analysis finished successfully
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={4} sx={{ mt: 3 }}>
          {/* Original Fragment */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <DescriptionIcon color="primary" fontSize="small" />
              <Typography variant="h6" fontWeight={600} color="primary">
                Original Fragment
              </Typography>
            </Stack>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
                borderLeft: (theme) => `4px solid ${theme.palette.primary.main}`,
              }}
            >
              <Typography variant="body1" sx={{ fontStyle: 'italic', lineHeight: 1.7 }}>
                "{report.original_fragment}"
              </Typography>
            </Paper>
          </Box>

          {/* Reconstructed Text */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <CheckCircleIcon color="success" fontSize="small" />
              <Typography variant="h6" fontWeight={600} color="success.main">
                Reconstructed Text
              </Typography>
            </Stack>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                bgcolor: (theme) => alpha(theme.palette.success.main, 0.05),
                borderColor: (theme) => alpha(theme.palette.success.main, 0.2),
                borderLeft: (theme) => `4px solid ${theme.palette.success.main}`,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.7 }}>
                {report.reconstructed_text}
              </Typography>
            </Paper>
          </Box>

          <Divider />

          {/* Confidence Score */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TrendingUpIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Confidence Score
                </Typography>
              </Stack>
              <Typography variant="h4" fontWeight={700} color="primary">
                {Math.round(report.reconstruction_confidence * 100)}%
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={report.reconstruction_confidence * 100}
              sx={{
                height: 12,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 2,
                  background: (theme) =>
                    `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            />
          </Box>

          {/* Era Detection */}
          {report.era_guess && (
            <Card
              variant="outlined"
              sx={{
                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.05),
                borderColor: (theme) => alpha(theme.palette.secondary.main, 0.2),
              }}
            >
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                  <ScheduleIcon color="secondary" />
                  <Typography variant="h6" fontWeight={600}>
                    Detected Era
                  </Typography>
                </Stack>
                <Chip
                  label={`${report.era_guess.label} (${Math.round(report.era_guess.confidence * 100)}% confidence)`}
                  color="secondary"
                  sx={{ fontWeight: 600, fontSize: '1rem', py: 2.5, px: 1 }}
                />
              </CardContent>
            </Card>
          )}

          {/* Explanation */}
          {report.explanation && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <DescriptionIcon color="info" fontSize="small" />
                <Typography variant="h6" fontWeight={600}>
                  AI Analysis
                </Typography>
              </Stack>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                {report.explanation}
              </Typography>
            </Box>
          )}

          {/* Keywords */}
          {report.keywords && report.keywords.length > 0 && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <LabelIcon color="primary" fontSize="small" />
                <Typography variant="h6" fontWeight={600}>
                  Keywords ({report.keywords.length})
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {report.keywords.map((keyword, idx) => (
                  <Chip
                    key={idx}
                    label={keyword}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Missing Words */}
          {report.missing_words && report.missing_words.length > 0 && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                <Typography variant="h6" fontWeight={600}>
                  Missing Words ({report.missing_words.length})
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {report.missing_words.map((word, idx) => (
                  <Chip
                    key={idx}
                    label={word}
                    size="medium"
                    variant="filled"
                    color="warning"
                    sx={{ fontWeight: 500 }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Sources */}
          {report.contextual_sources && report.contextual_sources.length > 0 && (
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <LanguageIcon color="info" />
                <Typography variant="h6" fontWeight={600}>
                  Contextual Sources ({report.contextual_sources.length})
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {report.contextual_sources.map((source, idx) => (
                  <Card
                    key={idx}
                    variant="outlined"
                    sx={{
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s',
                    }}
                  >
                    <CardContent>
                      <Typography variant="body1" fontWeight={600} gutterBottom>
                        {source.title}
                      </Typography>
                      <Link
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          fontSize: '0.875rem',
                          display: 'block',
                          mb: 1,
                          wordBreak: 'break-all',
                        }}
                      >
                        🔗 {source.url}
                      </Link>
                      {source.snippet && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          "{source.snippet}"
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>
          )}

          {/* Metadata */}
          <Divider />
          <Box
            sx={{
              bgcolor: (theme) => alpha(theme.palette.info.main, 0.05),
              p: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Processing Metadata
            </Typography>
            <Stack direction="row" spacing={4} flexWrap="wrap">
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Model
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {report.model_meta.model}
                </Typography>
              </Box>
              {report.model_meta.tokens_used && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tokens Used
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {report.model_meta.tokens_used.toLocaleString()}
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Generated
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(report.created_at).toLocaleString()}
                </Typography>
              </Box>
              {report.model_meta.demo_mode && (
                <Chip label="Demo Mode" size="small" color="warning" />
              )}
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Fade>
  );
}
