import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
import { Box, CircularProgress, Typography } from '@mui/material';
import { Character } from '@shared-types';

interface PersonaResponse {
  user_uuid: string;
  username: string;
  user_avatar: string;
}

interface ChatData {
  character: Character;
  firstMessage?: string;
}

export function ChatPage() {
  const { chat_uuid } = useParams<{ chat_uuid: string }>();
  const navigate = useNavigate();

  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<PersonaResponse | null>(null);
  const [userUuid, setUserUuid] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState(false);
  const [userDataError, setUserDataError] = useState(false);

  const { setFirstMessage, setMessages, clearData, messages } = useChatStore();

  useEffect(() => {
    const fetchUserUuid = async () => {
      const uuid = await GetUserUUID();
      setUserUuid(uuid);
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

        setUserData(updatedUserData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserDataError(true);
      }
    };

    fetchUserData();
  }, [userUuid]);

  useEffect(() => {
    const getChatData = async () => {
      if (chat_uuid && userUuid && userData) {
        try {
          clearData();
          const result = await fetchChatData(chat_uuid, userData.user_avatar);

          const updatedCharacter = {
            ...result.character,
          };

          setChatData({
            character: updatedCharacter,
            firstMessage: result.firstMessage,
          });

          setFirstMessage(
            result.firstMessage ?? updatedCharacter.first_message
          );

          setLoading(false);
          setFetchError(false);
        } catch (error) {
          console.error('Error fetching chat data:', error);
          setFetchError(true);
          setLoading(false);
        }
      }
    };

    getChatData();
  }, [chat_uuid, userUuid, userData, setFirstMessage, clearData]);

  if (
    loading ||
    !userData ||
    !chatData ||
    !chatData.character ||
    !chatData.character.char_uuid ||
    !chatData.character.profile_image ||
    !chatData.character.name
  ) {
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

  if (fetchError || !chat_uuid || userDataError) {
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
        position="relative"
      >
        <Box display={{ xs: 'none', lg: 'flex' }}>
          <Sidebar />
        </Box>

        <Box flex={1} overflow="auto" component="main">
          <ChatContainer
            user={userData}
            char={chatData.character}
            chat_uuid={chat_uuid}
          />
        </Box>

        <Box position="absolute" top="0" right="0">
          <PreviousChat />
        </Box>
      </Box>
    </motion.div>
  );
}
