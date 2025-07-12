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
  color: 'black',
  backgroundColor: '#00bcd4',
  transition: 'all 0.2s ease',
  borderRadius: 4,
  justifyContent: 'center',
  transform: 'scale(1)',
  '&:hover': {
    animation: `${zoomIn} 0.3s ease forwards`,
    backgroundColor: '#62efff',
    color: 'black',
    boxShadow: 'none',
  },
  '&:active': {
    transform: 'scale(0.96)',
  },
  ...(dataState === 'loading' && {
    opacity: 0.6,
    pointerEvents: 'none',
    userSelect: 'none',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
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
