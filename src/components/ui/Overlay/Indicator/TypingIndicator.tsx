import { Box, styled } from '@mui/material';

const Dot = styled('span')<{ delay: number }>(({ delay }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#333',
  animation: `bounceColor 1.5s ease-in-out ${delay}s infinite`,
  '@keyframes bounceColor': {
    '0%, 100%': {
      transform: 'translateY(-50%)',
      backgroundColor: '#333',
    },
    '50%': {
      transform: 'translateY(0)',
      backgroundColor: '#fff',
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
