import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Box } from '@mui/material';

export const PyrenzCharacterCard = styled(Card)({
  width: '100%',
  maxWidth: 360,
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'transform 0.5s ease, box-shadow 0.5s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#0f172a',
  },
  backgroundColor: '#111827',
});

export const PyrenzCharacterCardContent = styled(CardContent)({
  padding: '16px',
  width: '100%',
  boxSizing: 'border-box',
});

export const PyrenzCharacterCardImage = styled('div')({
  width: '100%',
  height: 200,
  overflow: 'hidden',
  position: 'relative',
});

export const PyrenzCharacterCardImageImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  position: 'relative',
  top: '10px',
});

export const PyrenzCharacterCardTitle = styled(Typography)({
  fontFamily: 'font-baloo, sans-serif',
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '8px',
  color: '#f8f9fa',
});

export const PyrenzCharacterCardDescription = styled(Typography)({
  fontFamily: 'font-baloo, sans-serif',
  fontSize: '0.875rem',
  color: '#adb5bd',
  marginBottom: '16px',
});

export const PyrenzCharacterCardTags = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '16px',
  width: '100%',
});

export const PyrenzCharacterCardTag = styled(Typography)({
  fontFamily: 'font-baloo, sans-serif',
  fontSize: '0.75rem',
  backgroundColor: '#0a0f1c',
  color: '#a5a5a6',
  padding: '4px 8px',
  borderRadius: '12px',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#f8f9fa',
  },
});

export const PyrenzAltTag = styled(Typography)({
  fontFamily: 'font-baloo, sans-serif',
  fontSize: '0.75rem',
  color: '#a5a5a6',
  borderRadius: '12px',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#f8f9fa',
  },
});
