import { Box, styled } from '@mui/material';

const Dot = styled('span')<{ delay: number }>(({ theme, delay }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: 'white',
  animation: `bounce 1.5s ease-in-out ${delay}s infinite`,
  '@keyframes bounce': {
    '0%, 100%': {
      transform: 'translateY(-50%)',
    },
    '50%': {
      transform: 'translateY(0)',
    },
  },
}));

export function TypingIndicator() {
  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      {[0, 1, 2].map((i) => (
        <Dot key={i} delay={i * 0.2} />
      ))}
    </Box>
  );
}
