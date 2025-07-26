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
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '~/store';

export function ChatHeader() {
  const theme = useTheme();
  const isMdScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();
  const { char } = useChatStore();

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
                <ArrowBack fontSize="small" />
              </IconButton>
            )}
            <IconButton
              sx={{ color: 'grey', '&:hover': { color: 'white' } }}
              aria-label="Character profile"
            >
              <Avatar
                alt={char?.name || 'Anon'}
                src={char?.profile_image || ''}
                sx={{ width: 40, height: 40 }}
              />
            </IconButton>
            <Typography variant="h6" sx={{ fontSize: '1rem' }}>
              {char?.name || 'Anon'}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Fade>
  );
}
