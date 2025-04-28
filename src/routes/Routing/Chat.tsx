import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useUserStore } from '~/store';
import { useChatStore } from '~/store';
import { fetchChatData } from '~/api';
import { Utils } from '~/Utility/Utility';
import {
  Sidebar,
  CharacterViewSidebar,
  ChatContainer,
  PreviousChat,
} from '~/components';
import { ChatPageSpinner } from '@ui/Spinner/Spinner';

interface PersonaResponse {
  user_uuid: string;
  name: string;
  user_name: string;
  icon: string;
}

export default function ChatPage() {
  const { user_uuid, auth_key } = useUserStore();
  const { conversation_id } = useParams<{ conversation_id: string }>();

  const [chatData, setChatData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<PersonaResponse | null>(null);
  const [chatDataFetched, setChatDataFetched] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const { setFirstMessage } = useChatStore();

  useEffect(() => {
    const getChatData = async () => {
      if (conversation_id && user_uuid && auth_key && !chatDataFetched) {
        try {
          setChatDataFetched(true);
          const result = await fetchChatData(
            conversation_id,
            user_uuid,
            auth_key
          );
          setChatData(result);

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
  }, [conversation_id, user_uuid, auth_key, setFirstMessage, chatDataFetched]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await Utils.post<PersonaResponse>('/api/getPersona', {
          user_uuid,
          auth_key,
        });
        setUserData(response);
      } catch {}
    };

    fetchUserData();
  }, [user_uuid, auth_key]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <ChatPageSpinner />
      </div>
    );
  }

  if (fetchError || !chatData) {
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
        {character && (
          <CharacterViewSidebar
            profilePic={character.profile_image}
            safeName={character.name}
          />
        )}
      </aside>

      <main className="flex-1 overflow-y-auto scrollbar-transparent">
        <ChatContainer
          user={userData}
          char={character}
          firstMessage={firstMessage || character.first_message}
          onSend={() => {}}
          previous_message={messages}
        />
      </main>

      <PreviousChat />
    </motion.div>
  );
}
