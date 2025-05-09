import { GetUserUUID, GetUserData } from '~/functions';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '~/store';
import { fetchChatData } from '~/api';
import { Sidebar, ChatContainer, PreviousChat } from '~/components';
import { Box, Typography, CircularProgress } from '@mui/material';

interface PersonaResponse {
  user_uuid: string;
  name: string;
  user_name: string;
  icon: string;
}

export default function ChatPage() {
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
      if (conversation_id && userUuid && !chatDataFetched) {
        try {
          clearData();
          setChatDataFetched(true);
          const result = await fetchChatData(conversation_id);

          const updatedCharacter = {
            ...result.character,
            icon: result.character.profile_image,
          };

          setChatData({ ...result, character: updatedCharacter });

          if (
            result?.character?.first_message &&
            result?.character?.id === result?.character?.id
          ) {
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
  }, [conversation_id, userUuid, setFirstMessage, chatDataFetched, clearData]);

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
          name: response.persona_name,
          user_name: response.persona_name,
          icon: `https://api.dicebear.com/9.x/adventurer/svg?seed=${response.persona_name.split('@')[0] || 'Anon'}`,
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
        style={{ display: 'flex', minHeight: '100vh', width: '100vw', color: 'white', backgroundColor: '#111827' }}
      >
        <Box component="aside" display={{ xs: 'none', lg: 'flex' }} flexDirection="column" width="256px">
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
            className="w-24 h-24 mb-5 animate-bounce cursor-pointer"
            onClick={() => navigate('/Home')}
          />
          <Typography variant="body1" color="textWhite">
            Unknown Chat or Character... Try again later.
          </Typography>
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
      style={{ display: 'flex', minHeight: '100vh', width: '100vw', color: 'white', backgroundColor: '#111827' }}
    >
      <Box component="aside" display={{ xs: 'none', lg: 'flex' }} flexDirection="column" width="256px">
        <Sidebar />
      </Box>

      <Box component="main" flex={1} overflow="auto" sx={{ scrollbarWidth: 'none' }}>
        <ChatContainer
          user={userData}
          char={character}
          firstMessage={firstMessage || character.first_message}
          previous_message={messages}
          conversation_id={conversation_id}
        />
      </Box>

      <PreviousChat />
    </motion.div>
  );
}
