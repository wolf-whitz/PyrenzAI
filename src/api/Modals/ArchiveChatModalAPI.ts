import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';

type Chat = {
  chat_uuid: string;
  char_uuid: string;
  preview_message: string;
  preview_image: string;
};

type Character = {
  char_uuid: string;
  name: string;
};

export const useArchiveChatModalAPI = (open: boolean, onClose: () => void) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [characters, setCharacters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [contextMenuAnchor, setContextMenuAnchor] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const chatsPerPage = 5;
  const totalPages = Math.ceil(chats.length / chatsPerPage);

  useEffect(() => {
    const fetchChats = async () => {
      const { data: chatsData, error: chatsError } = await supabase
        .from('chats')
        .select('chat_uuid, char_uuid, preview_message, preview_image');

      if (chatsError) {
        console.error('Error fetching chats:', chatsError);
        setIsLoading(false);
        return;
      }

      const truncatedChats = chatsData.map((chat: Chat) => ({
        ...chat,
        preview_message:
          chat.preview_message.length > 150
            ? chat.preview_message.substring(0, 150) + '...'
            : chat.preview_message,
      }));

      setChats(truncatedChats);

      const charUuids = [
        ...new Set(chatsData.map((chat: Chat) => chat.char_uuid)),
      ];
      const { data: charactersData, error: charactersError } = await supabase
        .from('characters')
        .select('char_uuid, name')
        .in('char_uuid', charUuids);

      if (charactersError) {
        console.error('Error fetching characters:', charactersError);
        setIsLoading(false);
        return;
      }

      const charactersMap = (charactersData as Character[]).reduce(
        (acc, character) => {
          acc[character.char_uuid] = character.name;
          return acc;
        },
        {} as Record<string, string>
      );

      setCharacters(charactersMap);
      setIsLoading(false);
    };

    if (open) {
      fetchChats();
    }
  }, [open]);

  const handleCardClick = (chatUuid: string) => {
    navigate(`/chat/${chatUuid}`);
    onClose();
  };

  const handleContextMenu = (event: React.MouseEvent, chat: Chat) => {
    event.preventDefault();
    setContextMenuAnchor({
      top: event.clientY + 2,
      left: event.clientX - 6,
    });
    setSelectedChat(chat);
  };

  const handleDeleteChat = async (chatUuid: string) => {
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('chat_uuid', chatUuid);

    if (error) {
      console.error('Error deleting chat:', error);
    } else {
      setChats(chats.filter(chat => chat.chat_uuid !== chatUuid));
      setContextMenuAnchor(null);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return {
    chats,
    characters,
    isLoading,
    contextMenuAnchor,
    selectedChat,
    handleCardClick,
    handleContextMenu,
    handleDeleteChat,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setContextMenuAnchor,
    setSelectedChat,
  };
};
