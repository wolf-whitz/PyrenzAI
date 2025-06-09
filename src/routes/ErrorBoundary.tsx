import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { Typography, Button, Box } from '@mui/material';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidMount() {
    AOS.init({
      duration: 1000,
    });
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
    const { error, errorInfo } = this.state;
    if (!error || !errorInfo) return;

    const timestamp = new Date()
      .toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      })
      .replace(',', ' |');

    const errorDetails = {
      timestamp: timestamp,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      pageURL: window.location.href,
      referrer: document.referrer,
      memory: (performance as any).memory,
      platform: navigator.platform,
      cores: navigator.hardwareConcurrency,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      devicePixelRatio: window.devicePixelRatio,
    };

    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(errorDetails, null, 2)
    )}`;

    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'error-details.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black">
          <div
            className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md"
            data-aos="fade-up"
          >
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              className="text-red-400 mb-4"
              data-aos="fade-down"
            >
              Something went wrong. The developer has been notified and is
              looking into the issue. (╥‸╥)
            </Typography>

            <Typography
              variant="body1"
              className="text-red-400 bg-gray-700 p-2 rounded border border-gray-600 mb-4"
              data-aos="fade-right"
            >
              {this.state.error && `Error details: ${this.state.error.message}`}
            </Typography>

            <Typography
              variant="body2"
              className="mb-4 text-center text-gray-300"
              data-aos="fade-left"
            >
              Please help us fix this issue by downloading the error details and
              sending them to our Discord server.
            </Typography>

            <Box className="flex gap-4 mt-5" data-aos="zoom-in">
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleDownloadErrorDetails}
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                }}
              >
                Download Error Details
              </Button>

              <Button
                variant="contained"
                color="secondary"
                onClick={() => window.location.reload()}
                sx={{
                  backgroundColor: '#d32f2f',
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: '#b71c1c',
                  },
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                }}
              >
                Reload Page
              </Button>
            </Box>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
