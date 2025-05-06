import { GetUserUUID, GetUserData } from '~/functions';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useChatStore } from '~/store';
import { fetchChatData } from '~/api';
import { Sidebar, ChatContainer, PreviousChat } from '~/components';
import { ChatPageSpinner } from '@ui/Spinner/Spinner';

interface PersonaResponse {
  user_uuid: string;
  name: string;
  user_name: string;
  icon: string;
}

export default function ChatPage() {
  const { conversation_id } = useParams<{ conversation_id: string }>();

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
      <div className="flex flex-col items-center justify-center h-screen">
        <ChatPageSpinner />
      </div>
    );
  }

  if (fetchError || !chatData || !conversation_id) {
    return (
      <div className="text-center text-white">
        Unknown Chat or Character... Try again later.
      </div>
    );
  }

  const { character, messages, firstMessage } = chatData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex min-h-screen w-full text-white bg-gray-900"
    >
      <aside className="hidden lg:flex flex-col w-64">
        <Sidebar />
      </aside>

      <main className="flex-1 overflow-y-auto scrollbar-transparent">
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
