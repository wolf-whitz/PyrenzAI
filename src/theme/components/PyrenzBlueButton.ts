import { Button, styled } from '@mui/material';

export const PyrenzBlueButton = styled(Button)({
  fontFamily: 'font-baloo, sans-serif',
  color: '#add8e6',
  transition: 'all 0.3s ease',
  borderRadius: '0',
  justifyContent: 'center',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: 'none',
  },
});
