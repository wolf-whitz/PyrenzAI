import { Button, CircularProgress, styled } from '@mui/material';
import { keyframes } from '@mui/system';

const zoomIn = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
`;

export const PyrenzBlueButton = styled(Button)<{ dataState?: string }>({
  fontFamily: 'font-baloo, sans-serif',
  color: 'white',
  transition: 'all 0.3s ease',
  borderRadius: '0',
  justifyContent: 'center',
  '&:hover': {
    animation: `${zoomIn} 0.3s ease forwards`,
    boxShadow: 'none',
  },
  '&[data-state="loading"]': {
    opacity: 0.6,
    pointerEvents: 'none',
    userSelect: 'none',
    position: 'relative',
  },
  ...({ dataState }: { dataState?: string }) => ({
    ...(dataState === 'loading' && {
      '&::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      },
    }),
  }),
});

