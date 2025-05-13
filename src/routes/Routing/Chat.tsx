import { GetUserUUID, GetUserData } from '~/functions';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatStore } from '~/store';
import { fetchChatData } from '~/api';
import { Sidebar, ChatContainer, PreviousChat } from '~/components';

interface PersonaResponse {
  user_uuid: string;
  name: string;
  username: string;
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
      <div className="flex justify-center items-center min-h-screen w-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (fetchError || !chatData || !conversation_id) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col min-h-screen w-screen text-white bg-gray-900"
      >
        <aside className="hidden lg:flex flex-col w-64">
          <Sidebar />
        </aside>

        <main className="flex flex-col justify-center items-center flex-1">
          <img
            src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MascotCrying.avif"
            alt="Mascot Crying"
            loading="lazy"
            className="w-24 h-24 mb-5 animate-bounce cursor-pointer"
            onClick={() => navigate('/Home')}
          />
          <p className="text-white">
            Unknown Chat or Character... Try again later. ˙◠˙?
          </p>
        </main>
      </motion.div>
    );
  }

  const { character, messages, firstMessage } = chatData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex min-h-screen w-screen text-white bg-gray-900"
    >
      <aside className="hidden lg:flex flex-col w-64">
        <Sidebar />
      </aside>

      <main className="flex-1 overflow-auto scrollbar-hide">
        <ChatContainer
          user={userData}
          char={character}
          firstMessage={firstMessage || character.first_message}
          previous_message={messages}
          conversation_id={conversation_id}
        />
      </main>

      <PreviousChat />
    </motion.div>
  );
}
