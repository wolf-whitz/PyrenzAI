import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Chip,
} from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { PyrenzBlueButton } from '~/theme';
import {
  CharacterPageLoader,
  Sidebar,
  MobileNav,
  useCharacterData
} from '~/components';
import { CreateNewChat } from '@function';
import { supabase } from '~/Utility';
import {
  PersonOutline as PersonIcon,
  MessageOutlined as MessageIcon,
  VisibilityOutlined as VisibilityIcon,
  ShieldOutlined as ShieldIcon,
  ArrowForward as ArrowForwardIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export function CharacterPage() {
  const { char_uuid } = useParams<{ char_uuid: string }>();
  const { character, notFound, handleDeleteCharacter } = useCharacterData(char_uuid);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState({
    startChat: false,
    editCharacter: false,
    deleteCharacter: false,
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserUuid = async () => {
      const { data } = await supabase.auth.getUser();
      setUserUuid(data?.user?.id || null);
    };
    fetchUserUuid();
  }, []);

  if (notFound) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#121212',
          color: 'white',
          minHeight: '100vh',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          404 - Character Not Found
        </Typography>
        <Typography variant="body1">
          The character you are looking for does not exist or you do not have
          permission to view it.
        </Typography>
      </Box>
    );
  }

  if (!character) {
    return <CharacterPageLoader />;
  }

  const handleStartChat = async () => {
    setIsLoading({ ...isLoading, startChat: true });
    const { data } = await supabase.auth.getUser();
    const user_uuid = data?.user?.id;
    if (!character || !user_uuid) {
      setIsLoading({ ...isLoading, startChat: false });
      return;
    }
    const result = await CreateNewChat(character.char_uuid, user_uuid);
    if (result.error) {
      console.error('Failed to create chat:', result.error);
    } else {
      console.log('Chat created successfully:', result.chat_uuid);
      navigate(`/chat/${result.chat_uuid}`);
    }
    setIsLoading({ ...isLoading, startChat: false });
  };

  const handleCharacterDeletion = async () => {
    setIsLoading({ ...isLoading, deleteCharacter: true });
    const success = await handleDeleteCharacter();
    if (success) {
      navigate('/Home');
    }
    setIsLoading({ ...isLoading, deleteCharacter: false });
  };

  const handleCreatorClick = () => {
    navigate(`/profile/${character.creator_uuid}`);
  };

  const handleEditCharacter = () => {
    setIsLoading({ ...isLoading, editCharacter: true });
    navigate(`/create/${character.char_uuid}`);
    setIsLoading({ ...isLoading, editCharacter: false });
  };

  const isCreator = userUuid === character.creator_uuid;

  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: '#121212',
        color: 'white',
        minHeight: '100vh',
        pb: 6,
      }}
    >
      <Box sx={{ display: { xs: 'none', md: 'block' }, p: 5, pr: 3 }}>
        <Sidebar />
      </Box>
      {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          <Box component="section" flex={{ md: 1 }}>
            <Card
              sx={{
                backgroundColor: '#1E1E1E',
                color: 'white',
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <CardMedia
                component="img"
                height="300"
                image={character.profile_image}
                alt={character.name}
                sx={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 'bold' }}
                >
                  {character.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  display="flex"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <PersonIcon sx={{ mr: 1, color: 'white' }} />
                  Created by:&nbsp;{' '}
                  <Typography
                    component="span"
                    sx={{
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: 'medium',
                    }}
                    onClick={handleCreatorClick}
                  >
                    {character.creator}
                  </Typography>
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {character.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      sx={{ backgroundColor: '#333', color: 'white' }}
                    />
                  ))}
                </Box>
                <PyrenzBlueButton
                  variant="contained"
                  sx={{ mt: 3, py: 1.5 }}
                  fullWidth
                  onClick={handleStartChat}
                  disabled={isLoading.startChat}
                  endIcon={<ArrowForwardIcon />}
                >
                  {isLoading.startChat ? 'Loading...' : 'Start Chat'}
                </PyrenzBlueButton>
                {isCreator && (
                  <>
                    <PyrenzBlueButton
                      variant="contained"
                      sx={{ mt: 2, py: 1.5 }}
                      fullWidth
                      onClick={handleEditCharacter}
                      disabled={isLoading.editCharacter}
                      startIcon={<EditIcon />}
                    >
                      {isLoading.editCharacter ? 'Loading...' : 'Edit Character'}
                    </PyrenzBlueButton>
                    <PyrenzBlueButton
                      variant="contained"
                      sx={{ mt: 2, py: 1.5, backgroundColor: 'error.main' }}
                      fullWidth
                      onClick={handleCharacterDeletion}
                      disabled={isLoading.deleteCharacter}
                      startIcon={<DeleteIcon />}
                    >
                      {isLoading.deleteCharacter ? 'Loading...' : 'Delete Character'}
                    </PyrenzBlueButton>
                  </>
                )}
              </CardContent>
            </Card>
          </Box>
          <Box component="section" flex={{ md: 2 }}>
            <Card
              sx={{
                backgroundColor: '#1E1E1E',
                color: 'white',
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                component="h3"
                sx={{ fontWeight: 'bold' }}
              >
                Greeting
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                {character.first_message}
              </Typography>
              <Divider sx={{ my: 3, backgroundColor: '#333' }} />
              <Typography
                variant="h5"
                gutterBottom
                component="h3"
                sx={{ fontWeight: 'bold' }}
              >
                Description
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.6 }}>
                {character.description}
              </Typography>
              <Divider sx={{ my: 3, backgroundColor: '#333' }} />
              <Typography
                variant="h6"
                gutterBottom
                component="h4"
                sx={{ fontWeight: 'bold' }}
              >
                Character Details
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={2}>
                <Box flex={1} minWidth={150} display="flex" alignItems="center">
                  <MessageIcon sx={{ mr: 1, color: 'white' }} />
                  <Typography variant="body2">
                    <strong>Interactions:</strong>{' '}
                    {character.chat_messages_count || 0}
                  </Typography>
                </Box>
                <Box flex={1} minWidth={150} display="flex" alignItems="center">
                  <VisibilityIcon sx={{ mr: 1, color: 'white' }} />
                  <Typography variant="body2">
                    <strong>Visibility:</strong>{' '}
                    {character.is_public ? 'Public' : 'Private'}
                  </Typography>
                </Box>
                <Box flex={1} minWidth={150} display="flex" alignItems="center">
                  <ShieldIcon sx={{ mr: 1, color: 'white' }} />
                  <Typography variant="body2">
                    <strong>Content Rating:</strong>{' '}
                    {character.is_nsfw ? 'NSFW' : 'SFW'}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
