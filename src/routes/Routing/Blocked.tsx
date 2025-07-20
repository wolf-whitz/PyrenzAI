import { Box, Typography } from '@mui/material';

export const BlockedPage = () => {
  return (
    <Box
      display="flex"
      height="100vh"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      p={4}
    >
      <Typography variant="h4">
        With accordance to the New Digital Markets Act, we have decided not to operate in the United Kingdom, nor will our services work there.
      </Typography>
    </Box>
  );
};
