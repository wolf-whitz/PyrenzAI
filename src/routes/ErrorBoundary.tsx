import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import {
  Typography,
  Box,
  Paper,
  Container,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { PyrenzBlueButton } from '~/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error);
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleDownloadErrorDetails = () => {
    const { error } = this.state;
    if (!error) return;

    const errorDetails = {
      errorMessage: error.message,
      errorStack: error.stack,
      userAgent: navigator.userAgent,
      pageURL: window.location.href,
      referrer: document.referrer,
      memory: (performance as any)?.memory,
      platform: navigator.platform,
      cores: navigator.hardwareConcurrency,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
    };

    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(errorDetails, null, 2)
    )}`;

    const anchor = document.createElement('a');
    anchor.setAttribute('href', dataStr);
    anchor.setAttribute('download', 'error-details.json');
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: '100vh',
            background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #121212 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
          }}
        >
          <Container maxWidth="sm">
            <Paper
              elevation={10}
              sx={{
                p: 4,
                borderRadius: 4,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                textAlign: 'center',
              }}
            >
              <ErrorOutlineIcon
                fontSize="large"
                sx={{
                  color: '#ff6b6b',
                  fontSize: 48,
                  mb: 2,
                }}
              />

              <Typography
                variant="h5"
                sx={{ color: '#ff6b6b', fontWeight: 600, mb: 2 }}
              >
                Something went wrong.
              </Typography>

              {this.state.error?.message && (
                <Typography
                  variant="body2"
                  sx={{
                    color: '#ff8a80',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 1,
                    p: 1,
                    mb: 2,
                    wordBreak: 'break-word',
                  }}
                >
                  Error: {this.state.error.message}
                </Typography>
              )}

              <Typography
                variant="body2"
                sx={{ color: '#ccc', mb: 3 }}
              >
                Please download the error details and send them to our team via Discord.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  justifyContent: 'center',
                }}
              >
                <PyrenzBlueButton onClick={this.handleDownloadErrorDetails}>
                  Download Error Details
                </PyrenzBlueButton>

                <PyrenzBlueButton
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </PyrenzBlueButton>
              </Box>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}
