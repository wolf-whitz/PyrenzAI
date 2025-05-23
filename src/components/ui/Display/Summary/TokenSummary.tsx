import { Typography, Box } from '@mui/material';
import { useCharacterStore } from '~/store';
import { useEffect } from 'react';

export function TokenSummary({ updateTokenTotal }: { updateTokenTotal: (total: number) => void }) {
  const tokenTotal = useCharacterStore(state => state.token_total);

  useEffect(() => {
    updateTokenTotal(Math.round(tokenTotal));
  }, [tokenTotal, updateTokenTotal]);

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
