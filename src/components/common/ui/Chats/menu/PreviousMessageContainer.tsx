import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserStore } from '~/store';
import { Avatar, CircularProgress, Typography } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';

interface Chat {
  id: string;
  user_uuid: string;
  chat_uuid: string;
  preview_message: string;
  created_at: string;
}

export default function PreviousChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { conversation_id } = useParams<{ conversation_id: string }>();
  const navigate = useNavigate();
  const { user_uuid } = useUserStore();

  useEffect(() => {
    const fetchPreviousChats = async () => {
      if (!user_uuid) {
        setError('User information is missing.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('chats')
          .select('id, user_uuid, chat_uuid, preview_message, created_at')
          .eq('user_uuid', user_uuid)
          .order('created_at', { ascending: false });

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
  }, [user_uuid]);

  const truncateMessage = (text: string, maxLength = 50) => {
    return text?.length > maxLength
      ? text.slice(0, maxLength) + '...'
      : text || '';
  };

  const handleMessageClick = (chatUuid: string) => {
    navigate(`/chat/${chatUuid}`);
    window.location.reload();
  };

  return (
    <aside className="hidden lg:flex flex-col justify-end w-64 p-4 h-full">
      <div className="rounded-xl w-full bg-gray-800 flex-grow overflow-auto min-h-[200px] max-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <CircularProgress />
            <Typography variant="body2" color="textSecondary">
              Loading previous chats...
            </Typography>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <motion.img
              src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MascotCrying.avif"
              alt="Crying Mascot"
              className="w-24 h-24 mt-2"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <Typography variant="body2" color="textSecondary">
              {error}
            </Typography>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <motion.img
              src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MascotCrying.avif"
              alt="Crying Mascot"
              className="w-24 h-24 mt-3"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <Typography variant="body2" color="textSecondary">
              No chats to load. Start a new conversation!
            </Typography>
          </div>
        ) : (
          chats.slice(0, 11).map((chat) => (
            <motion.div
              key={chat.id}
              data-chat-id={chat.chat_uuid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-start space-x-4 p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700"
              onClick={() => handleMessageClick(chat.chat_uuid)}
            >
              <Avatar
                src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MascotSmiling.avif"
                alt="Chat avatar"
                className="w-12 h-12"
              />
              <div className="flex-1">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="break-words"
                >
                  {truncateMessage(chat.preview_message)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(chat.created_at).toLocaleString()}
                </Typography>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </aside>
  );
}
