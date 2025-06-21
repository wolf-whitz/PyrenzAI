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
import { Character } from '@shared-types';

interface ChatHeaderProps {
  char: Character;
  toggleSettings: () => void;
}

export function ChatHeader({
  char,
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
              sx={{ color: 'grey', '&:hover': { color: 'white' } }}
              aria-label="Character profile"
            >
              <Avatar
                alt={char.name || 'Anon'}
                src={char.profile_image || ''}
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
            <Typography variant="h6" sx={{ fontSize: '1rem' }}>
              {char.name || 'Anon'}
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
