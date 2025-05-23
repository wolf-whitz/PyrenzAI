import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography } from '@mui/material';

export const PyrenzChatsCharacterCard = styled(Card)({
  display: 'flex',
  width: '100%',
  maxWidth: 400,
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  backgroundColor: '#111827',
  color: '#f8f9fa',
});

export const PyrenzCardImage = styled('div')({
  width: 100,
  height: 100,
  overflow: 'hidden',
  position: 'relative',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover', 
    transition: 'transform 0.5s ease',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
});


export const PyrenzCardName = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '8px',
  color: '#f8f9fa',
});

export const PyrenzCardContent = styled(CardContent)({
  flex: '1',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  '&:last-child': {
    paddingBottom: '16px',
  },
});
