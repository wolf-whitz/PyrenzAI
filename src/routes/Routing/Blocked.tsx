import { Box, Typography, Container } from '@mui/material';

export const BlockedPage = () => {
  return (
    <Box
      display="flex"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      bgcolor="background.default"
      color="text.primary"
    >
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Access Restricted in the United Kingdom
        </Typography>
        <Typography variant="body1">
          In compliance with the UK’s Online Safety Act, access to this
          application is currently unavailable within the United Kingdom.
        </Typography>
        <Typography variant="body2" mt={4} color="text.secondary">
          If you're accessing this service from within the UK, we kindly ask
          that you refrain from using the platform. If you're outside the UK and
          believe this is an error, using a VPN may help resolve the issue.
        </Typography>
      </Container>
    </Box>
  );
};
