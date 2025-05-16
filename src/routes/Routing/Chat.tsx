import { GetUserUUID, GetUserData } from '~/functions';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '~/store';
import { fetchChatData } from '~/api';
import { Sidebar, ChatContainer, PreviousChat } from '~/components';
import { Box, CircularProgress, Typography } from '@mui/material';

interface PersonaResponse {
  user_uuid: string;
  name: string;
  username: string;
  icon: string;
}

export function ChatPage() {
  const { conversation_id } = useParams<{ conversation_id: string }>();
  const navigate = useNavigate();

  const [chatData, setChatData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<PersonaResponse | null>(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [chatDataFetched, setChatDataFetched] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const { setFirstMessage, clearData } = useChatStore();

  useEffect(() => {
    const fetchUserUuid = async () => {
      const uuid = await GetUserUUID();
      setUserUuid(uuid);
    };

    fetchUserUuid();
  }, []);

  useEffect(() => {
    const getChatData = async () => {
      if (conversation_id && userUuid && userData && !chatDataFetched) {
        try {
          clearData();
          setChatDataFetched(true);
          const result = await fetchChatData(
            conversation_id,
            userData.username,
            userData.icon
          );

          const updatedCharacter = {
            ...result.character,
            icon: result.character.profile_image,
          };

          setChatData({ ...result, character: updatedCharacter });

          if (result?.character?.first_message) {
            setFirstMessage(result.character.first_message);
          } else {
            setFirstMessage('');
          }

          setFetchError(false);
        } catch (error) {
          setFetchError(true);
        } finally {
          setLoading(false);
        }
      }
    };

    getChatData();
  }, [
    conversation_id,
    userUuid,
    userData,
    setFirstMessage,
    chatDataFetched,
    clearData,
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userUuid) return;

      try {
        const response = await GetUserData();
        if ('error' in response) {
          console.error('Error fetching user data:', response.error);
          return;
        }

        const updatedUserData: PersonaResponse = {
          user_uuid: userUuid,
          name: response.username,
          username: response.username,
          icon: response.icon || '',
        };

        setUserData(updatedUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userUuid]);

  if (loading) {
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

  if (fetchError || !chatData || !conversation_id) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
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
              loading="lazy"
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
      </motion.div>
    );
  }

  const { character, messages, firstMessage } = chatData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
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

        <Box flex={1} overflow="auto">
          <ChatContainer
            user={userData}
            char={character}
            firstMessage={firstMessage || character.first_message}
            previous_message={messages}
            conversation_id={conversation_id}
          />
        </Box>

        <PreviousChat />
      </Box>
    </motion.div>
  );
}
