import { Button, styled } from '@mui/material';

interface MuiBlueButtonProps {
  Blue?: boolean;
}

export const MuiBlueButton = styled(Button)<MuiBlueButtonProps>(({ Blue }) => ({
  fontFamily: 'font-baloo, sans-serif',
  backgroundColor: Blue ? 'transparent' : '#add8e6',
  color: Blue ? '#add8e6' : '#FFFFFF',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: Blue ? 'rgba(33, 150, 243, 0.1)' : '#1976D2',
    color: Blue ? '#FFFFFF' : '#FFFFFF',
    borderColor: '#2196F3',
    transform: 'scale(1.05)',
  },
}));
