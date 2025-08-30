import { Typography, Box } from '@mui/material';
import { useCharacterStore } from '~/store';

export function TokenSummary() {
  const permanentTokens = useCharacterStore(
    (state) => state.permanentTokens || 0
  );
  const temporaryTokens = useCharacterStore(
    (state) => state.temporaryTokens || 0
  );
  const tokenTotal = useCharacterStore((state) => state.tokenTotal || 0);

  return (
    <Box className="mt-4">
      <Typography variant="h6" component="strong" className="text-gray-400">
        Token Summary
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <Typography variant="body1" className="text-gray-400">
          Permanent Tokens: {Math.round(permanentTokens)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <Typography variant="body1" className="text-gray-400">
          Temporary Tokens: {Math.round(temporaryTokens)}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <Typography variant="body1" className="text-gray-400">
          Total Tokens: {Math.round(tokenTotal)}
        </Typography>
      </Box>
    </Box>
  );
}
