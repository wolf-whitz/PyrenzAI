import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '@components';

interface Chat {
  id: string;
  chat_uuid: string;
  preview_message: string;
  preview_image: string;
}

interface ContextMenu {
  mouseX: number;
  mouseY: number;
  chatId: string | null;
}

export const usePreviousChatAPI = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const navigate = useNavigate();
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchPreviousChats = async (pageNumber: number) => {
    try {
      const userUUID = await GetUserUUID();

      if (!userUUID) {
        setError('User information is missing.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('get_chats', {
        page: pageNumber,
        per_page: 5,
      });

      if (error) throw error;

      if (data && data.Characters) {
        const formattedChats = Object.entries(data.Characters).map(
          ([chat_uuid, chatData]: [string, any]) => ({
            id: chatData.char_uuid,
            chat_uuid,
            preview_message: chatData.preview_message,
            preview_image: chatData.preview_image,
          })
        );

        setChats((prevChats) =>
          pageNumber === 0 ? formattedChats : [...prevChats, ...formattedChats]
        );
        setHasMore(formattedChats.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error('Failed to fetch previous chats:', err);
      setError('Failed to load previous chats. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousChats(page);
  }, [page]);

  const handleContextMenu = (event: React.MouseEvent, chatId: string) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
            chatId,
          }
        : null
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleDelete = async (chatId: string | null | undefined) => {
    if (!chatId) return;

    try {
      const { error } = await supabase.from('chats').delete().eq('id', chatId);

      if (error) throw error;

      setChats(chats.filter((chat) => chat.id !== chatId));
    } catch (err: any) {
      console.error('Failed to delete chat:', err);
      setError('Failed to delete chat. Please try again later.');
    } finally {
      handleClose();
    }
  };

  const handleMouseDown = (event: React.MouseEvent, chatId: string) => {
    longPressTimer.current = setTimeout(() => {
      handleContextMenu(event, chatId);
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const isInitialLoading = page === 0 && loading;

  return {
    chats,
    isInitialLoading,
    loading,
    error,
    contextMenu,
    handleMessageClick: (chatUuid: string) => {
      navigate(`/chat/${chatUuid}`);
      window.location.reload();
    },
    handleContextMenu,
    handleClose,
    handleDelete,
    handleMouseDown,
    handleMouseUp,
    truncateMessage: (text: string, maxLength = 50) =>
      text?.length > maxLength ? text.slice(0, maxLength) + '...' : text || '',
    loadMore,
    hasMore,
  };
};
