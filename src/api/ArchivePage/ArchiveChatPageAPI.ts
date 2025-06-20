import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';

type Character = {
  char_uuid: string;
  name: string;
};

type Chat = {
  chat_uuid: string;
  char_uuid: string;
  preview_message: string;
  preview_image: string;
  is_pinned: boolean;
};

interface UseArchiveChatPageAPIProps {
  chats: Chat[];
  characters: Record<string, string>;
  isLoading: boolean;
  handleCardClick: (chatUuid: string) => void;
  handleDeleteChat: (chatUuid: string) => Promise<void>;
  handlePinChat: (chatUuid: string) => Promise<void>;
  currentPage: number;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
}

export const useArchiveChatPageAPI = (
  open: boolean,
  onClose: () => void
): UseArchiveChatPageAPIProps => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [characters, setCharacters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const navigate = useNavigate();

  const chatsPerPage: number = 5;
  const totalPages: number = Math.ceil(chats.length / chatsPerPage);

  useEffect(() => {
    const fetchChats = async () => {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('chat_uuid, char_uuid, preview_message, preview_image, is_pinned')
        .order('is_pinned', { ascending: false });

      if (chatsError) {
        console.error('Error fetching chats:', chatsError);
        setIsLoading(false);
        return;
      }

      const truncatedChats: Chat[] = chatsData.map((chat: Chat) => ({
        ...chat,
        preview_message:
          chat.preview_message.length > 150
            ? chat.preview_message.substring(0, 150) + '...'
            : chat.preview_message,
      }));

      setChats(truncatedChats);

      const charUuids: string[] = [
        ...new Set(chatsData.map((chat: Chat) => chat.char_uuid)),
      ];

      const characterTables = ['public_characters', 'private_characters'];
      let allCharactersData: Character[] = [];

      for (const table of characterTables) {
        const { data: charactersData, error: charactersError } = await supabase
          .from(table)
          .select('char_uuid, name')
          .in('char_uuid', charUuids);

        if (charactersError) {
          console.error(`Error fetching ${table}:`, charactersError);
          continue;
        }

        if (charactersData) {
          allCharactersData = [...allCharactersData, ...charactersData];
        }
      }

      const charactersMap: Record<string, string> = allCharactersData.reduce(
        (acc: Record<string, string>, character: Character) => {
          acc[character.char_uuid] = character.name;
          return acc;
        },
        {}
      );

      setCharacters(charactersMap);
      setIsLoading(false);
    };

    if (open) {
      fetchChats();
    }
  }, [open]);

  const handleCardClick = (chatUuid: string): void => {
    navigate(`/chat/${chatUuid}`);
    console.log('Navigating to chat:', chatUuid);
    onClose();
  };

  const handleDeleteChat = async (chatUuid: string): Promise<void> => {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('chat_uuid', chatUuid);

    if (error) {
      console.error('Error deleting chat:', error);
    } else {
      setChats(chats.filter((chat: Chat) => chat.chat_uuid !== chatUuid));
    }
  };

  const handlePinChat = async (chatUuid: string): Promise<void> => {
    const { error } = await supabase
      .from('chats')
      .update({ is_pinned: true })
      .eq('chat_uuid', chatUuid);

    if (error) {
      console.error('Error pinning chat:', error);
    } else {
      setChats(
        chats.map((chat: Chat) =>
          chat.chat_uuid === chatUuid ? { ...chat, is_pinned: true } : chat
        )
      );
    }
  };

  const goToNextPage = (): void => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = (): void => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    chats: chats.slice(currentPage * chatsPerPage, (currentPage + 1) * chatsPerPage),
    characters,
    isLoading,
    handleCardClick,
    handleDeleteChat,
    handlePinChat,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  };
};
