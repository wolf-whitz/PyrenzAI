import React from 'react';
import { Typography, Box } from '@mui/material';

interface TokenSummaryProps {
  tokenTotal: number;
}

export function TokenSummary({ tokenTotal }: TokenSummaryProps) {
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
