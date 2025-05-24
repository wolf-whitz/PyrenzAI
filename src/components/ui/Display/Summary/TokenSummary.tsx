import { Typography, Box } from '@mui/material';
import { useCharacterStore } from '~/store';

export function TokenSummary() {
  const tokenTotal = useCharacterStore(state => state.token_total);

  return (
    <Box className="mt-4">
      <Typography variant="h6" component="strong" className="text-gray-400">
        Token Summary
      </Typography>
      <Typography variant="body1" className="text-gray-400">
        Total: {Math.round(tokenTotal)} Tokens
      </Typography>
    </Box>
  );
}
