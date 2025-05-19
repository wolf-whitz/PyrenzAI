import { Box, styled } from '@mui/material';

export const PyrenzMessageBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '60%',
  padding: '10px 15px',
  borderRadius: '18px',
  margin: '10px',
  backgroundColor: '#374151',
  color: '#fff',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  wordWrap: 'break-word',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    borderWidth: '10px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    bottom: '-10px',
    left: '10px',
  },
  '&.user': {
    '&::after': {
      left: 'auto',
      right: '10px',
      borderLeftColor: '#374151',
    },
  },
  '&.other': {
    '&::after': {
      borderRightColor: '#374151',
    },
  },
});
