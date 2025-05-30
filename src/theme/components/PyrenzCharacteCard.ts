import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Box } from '@mui/material';

export const PyrenzCharacterCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 360,
  height: 500,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  transition: 'transform 0.5s ease, box-shadow 0.5s ease',
  backgroundColor: '#111827',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
    backgroundColor: '#0f172a',
  },
  '&:focus-visible': {
    boxShadow: `0 0 0 3px ${theme.palette.primary.main}`,
  },
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '280px',
    height: 'auto',
  },
  [theme.breakpoints.down('xs')]: {
    maxWidth: '100%',
    height: 'auto',
  },
}));

export const PyrenzCharacterCardDescription = styled(Typography)({
  fontSize: '0.875rem',
  color: '#adb5bd',
  marginBottom: '16px',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
});

export const PyrenzCharacterCardContent = styled(CardContent)({
  padding: '16px',
  width: '100%',
  boxSizing: 'border-box',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

export const PyrenzCharacterCardImage = styled('div')({
  width: '100%',
  height: 200,
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const PyrenzCharacterCardImageImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  userSelect: 'none',
  pointerEvents: 'auto',
  draggable: false as any,
});

export const PyrenzCharacterCardTitle = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '8px',
  color: '#f8f9fa',
});

export const PyrenzCharacterCardTags = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 16,
  maxHeight: 72,
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  '&::after': {
    content: "''",
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: 24,
    pointerEvents: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export const PyrenzCharacterCardTag = styled(Typography)({
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
  fontSize: '0.75rem',
  color: '#a5a5a6',
  borderRadius: '12px',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#f8f9fa',
  },
});
