import React, { Component, ErrorInfo, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { Container, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
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
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container
          maxWidth="sm"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            style={{
              color: '#d32f2f',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            Something went wrong. The developer has been notified and is
            looking into the issue. (╥‸╥)
          </Typography>

          <Typography
            variant="body1"
            style={{
              color: '#d32f2f',
              backgroundColor: '#ffebee',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ef9a9a',
            }}
          >
            {this.state.error && `Error details: ${this.state.error.message}`}
          </Typography>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
