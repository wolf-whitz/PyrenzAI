import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';

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
    const { data, error } = await supabase.rpc('get_chats', {
      page,
      per_page: chatsPerPage,
    });

    if (error) {
      console.error('Error fetching chats via RPC:', error);
      setIsLoading(false);
      return;
    }
    if (!data) {
      console.error('No data returned from RPC');
      setIsLoading(false);
      return;
    }

    const parsed = typeof data === 'string' ? JSON.parse(data) : data;
    const charactersObj = parsed.Characters ?? {};
    const chatEntries = Object.entries(charactersObj) as [
      string,
      CharacterData,
    ][];

    const chatList: Chat[] = chatEntries.map(([chat_uuid, chatData]) => ({
      chat_uuid,
      char_uuid: chatData.char_uuid,
      preview_message: chatData.preview_message,
      preview_image: chatData.preview_image,
      is_pinned: chatData.is_pinned,
    }));

    const characterMap: Record<string, string> = {};
    for (const [, chatData] of chatEntries) {
      characterMap[chatData.char_uuid] = chatData.character_name;
    }

    setChats(chatList);
    setCharacters(characterMap);
    setTotalPages(parsed.TotalPages ?? 0);
    setIsLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchChats(currentPage);
    }
  }, [open, currentPage]);

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
      fetchChats(currentPage);
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
      fetchChats(currentPage);
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
