import { Box, Typography, Container } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

export const BlockedPage = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const isDeleted = type === 'deleted';
  const isBanned = type === 'banned';

  return (
    <Box
      display="flex"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      bgcolor="background.default"
      color="text.primary"
      px={2}
    >
      <Container maxWidth="sm">
        {isDeleted ? (
          <>
            <Typography variant="h4" gutterBottom>
              Account Deleted
            </Typography>
            <Typography variant="body1">
              Your account has been deleted. If you believe this was a mistake,
              please contact support.
            </Typography>
            <Typography variant="body2" mt={4} color="text.secondary">
              You’ve been logged out and can no longer access this platform.
            </Typography>
          </>
        ) : isBanned ? (
          <>
            <Typography variant="h4" gutterBottom>
              Account Banned
            </Typography>
            <Typography variant="body1">
              Your account has been permanently banned due to violations of our
              terms of service.
            </Typography>
            <Typography variant="body2" mt={4} color="text.secondary">
              Contact support if you think this decision was made in error.
            </Typography>
          </>
        ) : (
          <>
            <Typography variant="h4" gutterBottom>
              Access Restricted in the United Kingdom
            </Typography>
            <Typography variant="body1">
              In compliance with the UK’s Online Safety Act, access to this
              application is currently unavailable within the United Kingdom.
            </Typography>
            <Typography variant="body2" mt={4} color="text.secondary">
              If you're outside the UK and believe this is an error, using a VPN
              may help resolve the issue.
            </Typography>
          </>
        )}
      </Container>
    </Box>
  );
};
