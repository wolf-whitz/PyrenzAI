import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import {
  CharacterPageLoader,
  Sidebar,
  MobileNav,
  useCharacterData,
  CharacterProfile,
  CharacterDetails,
  AuthenticationModal,
} from '@components';
import { CreateNewChat } from '@function';
import { Utils } from '~/Utility';

export function CharacterPage() {
  const { char_uuid } = useParams<{ char_uuid: string }>();
  const {
    character,
    notFound,
    handleDeleteCharacter,
    handleReportCharacter,
  } = useCharacterData(char_uuid);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
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
      const { data } = await Utils.db.client.auth.getUser();
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
    if (!userUuid) {
      setAuthMode('login'); 
      setShowLoginModal(true);
      return;
    }

    setIsLoading((prev) => ({ ...prev, startChat: true }));
    try {
      const result = await CreateNewChat(character.char_uuid, userUuid);
      if (result.error) {
        console.error('Failed to create chat:', result.error);
      } else {
        console.log('Chat created successfully:', result.chat_uuid);
        navigate(`/chat/${result.chat_uuid}`);
      }
    } finally {
      setIsLoading((prev) => ({ ...prev, startChat: false }));
    }
  };

  const handleCharacterDeletion = async () => {
    setIsLoading((prev) => ({ ...prev, deleteCharacter: true }));
    const success = await handleDeleteCharacter();
    if (success) {
      navigate('/Home');
    }
    setIsLoading((prev) => ({ ...prev, deleteCharacter: false }));
  };

  const handleCreatorClick = () => {
    navigate(`/profile/${character.creator_uuid}`);
  };

  const handleEditCharacter = () => {
    setIsLoading((prev) => ({ ...prev, editCharacter: true }));
    navigate(`/create/${character.char_uuid}`);
    setIsLoading((prev) => ({ ...prev, editCharacter: false }));
  };

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
          <CharacterProfile
            character={character}
            isLoading={isLoading}
            userUuid={userUuid}
            handleStartChat={handleStartChat}
            handleEditCharacter={handleEditCharacter}
            handleCharacterDeletion={handleCharacterDeletion}
            handleCreatorClick={handleCreatorClick}
            handleReportCharacter={handleReportCharacter}
          />
          <CharacterDetails character={character} />
        </Box>
      </Box>

      {showLoginModal && (
        <AuthenticationModal
          mode={authMode}
          onClose={() => setShowLoginModal(false)}
          toggleMode={() =>
            setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'))
          }
        />
      )}
    </Box>
  );
}
