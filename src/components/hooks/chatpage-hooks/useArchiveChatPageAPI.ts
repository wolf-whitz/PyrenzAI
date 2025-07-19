import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Utils } from '~/Utility';

type Chat = {
  chat_uuid: string;
  char_uuid: string;
  preview_message: string;
  preview_image: string;
  is_pinned: boolean;
};

interface CharacterData {
  char_uuid: string;
  preview_message: string;
  preview_image: string;
  is_pinned: boolean;
  character_name: string;
}

interface ChatTable {
  chat_uuid: string;
  is_pinned: boolean;
  // Add other properties of the chat table here if necessary
}

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
  onClose: () => void,
  chatsPerPage: number
): UseArchiveChatPageAPIProps => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [characters, setCharacters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const navigate = useNavigate();

  const fetchChats = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await Utils.db.rpc('get_chats', {
        page,
        per_page: chatsPerPage,
      });

      if (!data) {
        throw new Error('No data returned from RPC');
      }

      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
      const charactersObj = parsedData.Characters || {};

      const chatEntries = Object.entries(charactersObj) as [
        string,
        CharacterData,
      ][];

      const chatList = chatEntries.map(([chat_uuid, chatData]) => ({
        chat_uuid,
        char_uuid: chatData.char_uuid,
        preview_message: chatData.preview_message,
        preview_image: chatData.preview_image,
        is_pinned: chatData.is_pinned,
      }));

      const characterMap = chatEntries.reduce<Record<string, string>>(
        (acc, [, chatData]) => {
          acc[chatData.char_uuid] = chatData.character_name;
          return acc;
        },
        {}
      );

      setChats(chatList);
      setCharacters(characterMap);
      setTotalPages(parsedData.TotalPages || 0);
    } catch (error) {
      console.error(
        'Error fetching chats:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchChats(currentPage);
    }
  }, [open, currentPage]);

  const handleCardClick = (chatUuid: string): void => {
    navigate(`/chat/${chatUuid}`);
    onClose();
  };

  const handleDeleteChat = async (chatUuid: string): Promise<void> => {
    try {
      await Utils.db.delete('chats', { chat_uuid: chatUuid });
      await fetchChats(currentPage);
    } catch (error) {
      console.error(
        'Error deleting chat:',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  };

  const handlePinChat = async (chatUuid: string): Promise<void> => {
    try {
      await Utils.db.update<ChatTable>(
        'chats',
        { is_pinned: true },
        { chat_uuid: chatUuid }
      );
      await fetchChats(currentPage);
    } catch (error) {
      console.error(
        'Error pinning chat:',
        error instanceof Error ? error.message : 'Unknown error'
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
    chats,
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
