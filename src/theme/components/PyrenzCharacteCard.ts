import { styled } from '@mui/material/styles'
import { Card, CardContent, Typography, Box } from '@mui/material'

export const PyrenzCharacterCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 360,
  height: 500,
  marginBottom: '10px',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '20px',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  backgroundColor: 'rgba(17, 24, 39, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  overflow: 'hidden',
  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
  transition: 'transform 0.4s ease, box-shadow 0.4s ease, background-color 0.4s ease',
  transformStyle: 'preserve-3d',
  '&:hover': {
    transform: 'translateY(-8px)',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
  },
  cursor: 'pointer',
  [theme.breakpoints.down('sm')]: {
    maxWidth: '100%',
    height: 420,
  },
}))

export const PyrenzCharacterCardImage = styled('div')({
  width: '100%',
  height: 200,
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const PyrenzCharacterCardImageImg = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  userSelect: 'none',
  pointerEvents: 'auto',
  draggable: false,
  transition: 'filter 0.3s ease',
  '&.nsfw': {
    filter: 'blur(4px)',
  },
  '&.nsfw:hover': {
    filter: 'none',
  },
})

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
}))

export const PyrenzCharacterCardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 600,
  marginBottom: '4px',
  color: '#f1f5f9',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
  },
}))

export const PyrenzCharacterCardDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: '#cbd5e1',
  marginBottom: '16px',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  [theme.breakpoints.down('sm')]: {
    WebkitLineClamp: 2,
    fontSize: '0.8rem',
  },
}))

export const PyrenzCharacterCardTags = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 'auto',
  maxHeight: 100,
  overflow: 'hidden',
  width: '100%',
})

export const PyrenzCharacterCardTag = styled(Typography)({
  fontSize: '0.75rem',
  backgroundColor: 'rgba(10, 15, 28, 0.5)',
  color: '#a5a5a6',
  padding: '4px 10px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  transition: 'all 0.25s ease',
  '&:hover': {
    color: '#f1f5f9',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
  },
})

export const PyrenzAltTag = styled(Typography)({
  fontSize: '0.75rem',
  color: '#a5a5a6',
  borderRadius: '10px',
  transition: 'color 0.3s ease',
  '&:hover': {
    color: '#f1f5f9',
  },
})
