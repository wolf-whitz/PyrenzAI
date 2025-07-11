import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@utils';
import { GetUserUUID } from '@components';

interface Chat {
  chat_uuid: string;
  preview_message: string;
  preview_image: string;
}

export const usePreviousChatAPI = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const navigate = useNavigate();

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

  const handleDelete = async (chatUuid: string | null | undefined) => {
    if (!chatUuid) return;

    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('chat_uuid', chatUuid);

      if (error) throw error;

      setChats(chats.filter((chat) => chat.chat_uuid !== chatUuid));
    } catch (err: any) {
      console.error('Failed to delete chat:', err);
      setError('Failed to delete chat. Please try again later.');
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
    handleMessageClick: (chatUuid: string) => {
      navigate(`/chat/${chatUuid}`);
      window.location.reload();
    },
    handleDelete,
    truncateMessage: (text: string, maxLength = 50) =>
      text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text || '',
    loadMore,
    hasMore,
  };
};
