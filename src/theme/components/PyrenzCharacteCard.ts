import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Box } from '@mui/material';

// Fixed-height Card
export const PyrenzCharacterCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 360,
  height: 500, // fixed height
  display: 'flex',
  flexDirection: 'column',
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
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    height: 420, // slightly smaller for small screens
  },
}));

// Image with fixed height
export const PyrenzCharacterCardImage = styled('div')({
  width: '100%',
  height: 200,
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

// Image
export const PyrenzCharacterCardImageImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  userSelect: 'none',
  pointerEvents: 'auto',
  draggable: false as any,
});

// Content Area
export const PyrenzCharacterCardContent = styled(CardContent)(({ theme }) => ({
  padding: '16px',
  width: '100%',
  boxSizing: 'border-box',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  [theme.breakpoints.down('sm')]: {
    padding: '12px',
  },
}));

// Title
export const PyrenzCharacterCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '8px',
  color: '#f8f9fa',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
  },
}));

// Description (clamped to avoid overflow)
export const PyrenzCharacterCardDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: '#adb5bd',
  marginBottom: '16px',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  [theme.breakpoints.down('sm')]: {
    WebkitLineClamp: 2,
    fontSize: '0.8rem',
  },
}));

// Tags Wrapper
export const PyrenzCharacterCardTags = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 'auto',
  maxHeight: 72,
  overflow: 'hidden',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

// Single Tag
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

// Alt text
export const PyrenzAltTag = styled(Typography)({
  fontSize: '0.75rem',
  color: '#a5a5a6',
  borderRadius: '12px',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#f8f9fa',
  },
});
