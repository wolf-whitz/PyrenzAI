import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '~/store';
import {
  Sidebar,
  ChatContainer,
  PreviousChat,
  fetchChatData,
  GetUserUUID,
  GetUserData,
} from '@components';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';
import { Character } from '@shared-types';

export function ChatPage() {
  const { chat_uuid } = useParams<{ chat_uuid: string }>();
  const navigate = useNavigate();

  const {
    setFirstMessage,
    setAlternativeFirstMessages,
    setUser,
    setChar,
    user,
    char,
  } = useChatStore();

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
          console.warn('User not authenticated - redirecting to login');
          setUserDataError(true);
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

        setUser({
          user_uuid: userUuid,
          username: response.username,
          user_avatar: response.user_avatar || '',
        });
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

      const result = await fetchChatData(chat_uuid);

      if (result.is_error) {
        console.error('Error fetching chat data:', result.error);
        setFetchError(true);
      } else {
        setChar(result.Character as Character);
        setFirstMessage(result.firstMessage ?? '');
        setAlternativeFirstMessages(result.alternativeFirstMessages ?? []);
        setFetchError(false);
      }
      setLoading(false);
    };

    getChatData();
  }, [
    chat_uuid,
    userUuid,
    user,
    setChar,
    setFirstMessage,
    setAlternativeFirstMessages,
  ]);

  return (
    <Fade in timeout={600}>
      <Box
        display="flex"
        minHeight="100vh"
        width="100vw"
        bgcolor="gray.900"
        color="white"
        position="relative"
      >
        {loading || !user ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            width="100vw"
          >
            <CircularProgress />
          </Box>
        ) : fetchError || !chat_uuid || userDataError || !char ? (
          <>
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
                  width: 96,
                  height: 96,
                  marginBottom: 20,
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/Home')}
              />
              <Typography variant="body1" color="white">
                Unknown Chat or Character... Try again later. ˙◠˙?
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Box display={{ xs: 'none', lg: 'flex' }}>
              <Sidebar />
            </Box>
            <Box flex={1} overflow="auto" component="main">
              <ChatContainer chat_uuid={chat_uuid} />
            </Box>
            <Box position="absolute" top={0} right={0}>
              <PreviousChat />
            </Box>
          </>
        )}
      </Box>
    </Fade>
  );
}
