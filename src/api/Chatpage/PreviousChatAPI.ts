import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '@components';

interface Chat {
  id: string;
  chat_uuid: string;
  preview_message: string;
  created_at: string;
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

  const navigate = useNavigate();
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchPreviousChats = async () => {
      try {
        const userUUID = await GetUserUUID();

        if (!userUUID) {
          setError('User information is missing.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('chats')
          .select('id, chat_uuid, preview_message, created_at, preview_image')
          .eq('user_uuid', userUUID)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        if (data && data.length > 0) {
          setChats(data as Chat[]);
        } else {
          setChats([]);
        }
      } catch (err: any) {
        console.error('Failed to fetch previous chats:', err);
        setError('Failed to load previous chats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreviousChats();
  }, []);

  const truncateMessage = (text: string, maxLength = 50) => {
    return text?.length > maxLength
      ? text.slice(0, maxLength) + '...'
      : text || '';
  };

  const handleMessageClick = (chatUuid: string) => {
    navigate(`/chat/${chatUuid}`);
    window.location.reload();
  };

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

  const handleExport = (chatId: string | null | undefined) => {
    if (!chatId) return;
    const chatToExport = chats.find((chat) => chat.id === chatId);
    if (chatToExport) {
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(chatToExport)
      )}`;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', `chat_${chatId}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    }
    handleClose();
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

  return {
    chats,
    loading,
    error,
    contextMenu,
    handleMessageClick,
    handleContextMenu,
    handleClose,
    handleDelete,
    handleExport,
    handleMouseDown,
    handleMouseUp,
    truncateMessage,
  };
};
