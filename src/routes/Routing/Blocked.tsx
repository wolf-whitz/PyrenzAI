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
          Region Access Restricted
        </Typography>
        <Typography variant="body1">
          Due to compliance with the Digital Markets Act, we currently do not offer services in your region (United Kingdom).
          <br />
          We kindly ask that you refrain from using this application while located in these areas.
        </Typography>
        <Typography variant="body2" mt={4} color="text.secondary">
          If you believe this is an error or wish to continue at your own discretion, using a VPN may help you access our services.
        </Typography>
      </Container>
    </Box>
  );
};
