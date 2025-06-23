import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '~/store';
import { fetchChatData } from '@api';
import {
  Sidebar,
  ChatContainer,
  PreviousChat,
  GetUserUUID,
  GetUserData,
} from '@components';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { Character } from '@shared-types';

export function ChatPage() {
  const { chat_uuid } = useParams<{ chat_uuid: string }>();
  const navigate = useNavigate();

  const { setFirstMessage, setUser, setChar, user, char } = useChatStore();

  const [loading, setLoading] = useState(true);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [userDataError, setUserDataError] = useState(false);

  useEffect(() => {
    const fetchUserUuid = async () => {
      try {
        const uuid = await GetUserUUID();
        if (uuid) {
          setUserUuid(uuid);
        } else {
          throw new Error('UUID is null');
        }
      } catch (error) {
        console.error('Failed to fetch user UUID:', error);
        setUserDataError(true);
      }
    };
    fetchUserUuid();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userUuid) return;

      try {
        const response = await GetUserData();
        if ('error' in response) {
          console.error('Error fetching user data:', response.error);
          setUserDataError(true);
          return;
        }

        const updatedUserData = {
          user_uuid: userUuid,
          username: response.username,
          user_avatar: response.user_avatar || '',
        };

        setUser(updatedUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserDataError(true);
      }
    };

    fetchUserData();
  }, [userUuid, setUser]);

  useEffect(() => {
    const getChatData = async () => {
      if (!chat_uuid || !userUuid || !user) return;

      const result = await fetchChatData(chat_uuid, user.user_avatar || '');

      if (result.is_error) {
        console.error('Error fetching chat data:', result.error);
        setFetchError(true);
      } else {
        const updatedChar = {
          ...result.Character,
        };

        setChar(updatedChar as Character);
        setFirstMessage(result.firstMessage ?? updatedChar.first_message ?? '');
        setFetchError(false);
      }
      setLoading(false);
    };

    getChatData();
  }, [chat_uuid, userUuid, user, setChar, setFirstMessage]);

  if (loading || !user) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        width="100vw"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError || !chat_uuid || userDataError || !char) {
    return (
      <Fade in={true} timeout={600}>
        <Box
          display="flex"
          minHeight="100vh"
          width="100vw"
          bgcolor="gray.900"
          color="white"
        >
          <Box display={{ xs: 'none', lg: 'flex' }} width="256px">
            <Sidebar />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            flex={1}
          >
            <img
              src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MascotCrying.avif"
              alt="Mascot Crying"
              style={{
                width: '96px',
                height: '96px',
                marginBottom: '20px',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/Home')}
            />
            <Typography variant="body1" color="white">
              Unknown Chat or Character... Try again later. ˙◠˙?
            </Typography>
          </Box>
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in={true} timeout={600}>
      <Box
        display="flex"
        minHeight="100vh"
        width="100vw"
        bgcolor="gray.900"
        color="white"
        position="relative"
      >
        <Box display={{ xs: 'none', lg: 'flex' }}>
          <Sidebar />
        </Box>

        <Box flex={1} overflow="auto" component="main">
          <ChatContainer chat_uuid={chat_uuid} />
        </Box>

        <Box position="absolute" top="0" right="0">
          <PreviousChat />
        </Box>
      </Box>
    </Fade>
  );
}
