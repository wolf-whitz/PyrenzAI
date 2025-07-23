import { Button, CircularProgress, Box, styled } from '@mui/material';
import { keyframes } from '@mui/system';
import type { ButtonProps } from '@mui/material';

const zoomIn = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.05);
  }
`;

interface PyrenzButtonProps extends ButtonProps {
  dataState?: 'loading' | string;
}

export const PyrenzBlueButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'dataState',
})<PyrenzButtonProps>(({ dataState }) => ({
  color: '#ffffff',
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  borderRadius: 14,
  padding: '10px 24px',
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  border: '1.5px solid rgba(174, 228, 255, 0.2)',
  boxShadow: 'none',
  position: 'relative',
  overflow: 'hidden',

  '&:hover': {
    animation: `${zoomIn} 0.3s ease forwards`,
    color: '#aee4ff',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    border: '1.5px solid rgba(174, 228, 255, 0.4)',
    boxShadow: 'none',
  },

  '&:active': {
    backgroundColor: 'rgba(0, 188, 212, 0.18)',
    color: '#ffffff',
    transform: 'scale(0.96)',
    border: '1.5px solid rgba(174, 228, 255, 0.3)',
    boxShadow: 'none',
  },

  ...(dataState === 'loading' && {
    opacity: 0.6,
    pointerEvents: 'none',
    userSelect: 'none',
  }),
}));

export const PyrenzBlueButtonWithLoading = ({
  dataState,
  ...props
}: PyrenzButtonProps) => {
  return (
    <Box position="relative" display="inline-block">
      <PyrenzBlueButton dataState={dataState} {...props} />
      {dataState === 'loading' && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            mt: '-12px',
            ml: '-12px',
          }}
        />
      )}
    </Box>
  );
};
