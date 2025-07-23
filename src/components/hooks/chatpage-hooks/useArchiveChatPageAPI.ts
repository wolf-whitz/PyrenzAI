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

interface CharacterTable {
  char_uuid: string;
  name: string;
}

interface ChatTable {
  chat_uuid: string;
  is_pinned: boolean;
  char_uuid: string;
  preview_message: string;
  preview_image: string;
  user_uuid: string;
  is_temporary: boolean;
  created_at: string;
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

export function useArchiveChatPageAPI(
  open: boolean,
  onClose: () => void,
  chatsPerPage: number
): UseArchiveChatPageAPIProps {
  const [chats, setChats] = useState<Chat[]>([]);
  const [characters, setCharacters] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();

  const fetchChats = async (page: number) => {
    setIsLoading(true);
    try {
      const rangeFrom = page * chatsPerPage;
      const rangeTo = rangeFrom + chatsPerPage - 1;

      const { data: chatData, count } = await Utils.db.select<ChatTable>(
        'chats',
        '*',
        'exact',
        { is_temporary: false },
        { from: rangeFrom, to: rangeTo },
        { column: 'created_at', ascending: false }
      );

      if (!chatData || chatData.length === 0) {
        setChats([]);
        setCharacters({});
        setTotalPages(0);
        return;
      }

      const uniqueCharUUIDs = Array.from(
        new Set(chatData.map((chat) => chat.char_uuid))
      );

      const [publicChars, privateChars] = await Promise.all([
        Utils.db.select<CharacterTable>(
          'public_characters',
          'char_uuid, name',
          null,
          {},
          undefined,
          undefined,
          [{ column: 'char_uuid', operator: 'in', value: uniqueCharUUIDs }]
        ),
        Utils.db.select<CharacterTable>(
          'private_characters',
          'char_uuid, name',
          null,
          {},
          undefined,
          undefined,
          [{ column: 'char_uuid', operator: 'in', value: uniqueCharUUIDs }]
        ),
      ]);

      const allCharacters = [
        ...(publicChars.data || []),
        ...(privateChars.data || []),
      ];

      const characterMap: Record<string, string> = {};
      allCharacters.forEach((char) => {
        characterMap[char.char_uuid] = char.name;
      });

      const chatList: Chat[] = chatData
        .map((chat) => ({
          chat_uuid: chat.chat_uuid,
          char_uuid: chat.char_uuid,
          preview_message: chat.preview_message,
          preview_image: chat.preview_image,
          is_pinned: chat.is_pinned,
        }))
        .sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned));

      setChats(chatList);
      setCharacters(characterMap);
      setTotalPages(count ? Math.ceil(count / chatsPerPage) : 0);
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchChats(currentPage);
    }
  }, [open, currentPage]);

  const handleCardClick = (chatUuid: string) => {
    navigate(`/chat/${chatUuid}`);
    onClose();
  };

  const handleDeleteChat = async (chatUuid: string) => {
    try {
      await Utils.db.delete('chats', { chat_uuid: chatUuid });
      await fetchChats(currentPage);
    } catch (err) {
      console.error('Error deleting chat:', err);
    }
  };

  const handlePinChat = async (chatUuid: string) => {
    try {
      await Utils.db.update<ChatTable>(
        'chats',
        { is_pinned: true },
        { chat_uuid: chatUuid }
      );
      await fetchChats(currentPage);
    } catch (err) {
      console.error('Error pinning chat:', err);
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
    handleCardClick,
    handleDeleteChat,
    handlePinChat,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  };
}
