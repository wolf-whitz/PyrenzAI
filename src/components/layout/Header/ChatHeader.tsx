import React from 'react';
import {
  Avatar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Box,
  Fade,
  Container,
} from '@mui/material';
import { ArrowLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  char: {
    character_name?: string;
    icon?: string;
  };
  handleGoHome: () => void;
  toggleSettings: () => void;
}

export function ChatHeader({
  char,
  handleGoHome,
  toggleSettings,
}: ChatHeaderProps) {
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();

  const handleArrowLeftClick = () => {
    navigate('/#');
  };

  return (
    <Fade in={true} timeout={500}>
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            {!isMdScreen && (
              <IconButton
                onClick={handleArrowLeftClick}
                sx={{ color: 'grey', '&:hover': { color: 'white' } }}
                aria-label="Go to home"
              >
                <ArrowLeft size={24} />
              </IconButton>
            )}
            <IconButton
              onClick={handleGoHome}
              sx={{ color: 'grey', '&:hover': { color: 'white' } }}
              aria-label="Go home"
            >
              <Avatar
                alt={char.character_name || 'Anon'}
                src={char.icon || ''}
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
            <Typography variant="h6" sx={{ fontSize: '1rem' }}>
              {char.character_name || 'Anon'}
            </Typography>
            <IconButton
              onClick={toggleSettings}
              sx={{
                color: 'grey',
                transition: 'transform 0.3s ease, color 0.3s ease',
                '&:hover': {
                  transform: 'rotate(90deg)',
                  color: 'white',
                },
              }}
              aria-label="Settings"
            >
              <Settings size={24} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Fade>
  );
}
