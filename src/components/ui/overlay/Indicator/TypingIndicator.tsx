import { Box, styled } from '@mui/material';

const Dot = styled('span')<{ delay: number }>(({ delay }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#333',
  animation: `fadeColor 1.5s ease-in-out ${delay}s infinite`,
  '@keyframes fadeColor': {
    '0%, 100%': {
      backgroundColor: '#333',
    },
    '50%': {
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
