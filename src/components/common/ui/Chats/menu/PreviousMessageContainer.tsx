import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Utils } from '~/Utility/Utility';
import { useUserStore } from '~/store';
import { Avatar, CircularProgress, Typography } from '@mui/material';

interface Message {
  id: string;
  conversation_id: string;
  message: string;
  character_image_url: string;
  created_at: string;
  user_uuid: string;
}

interface ApiResponse {
  messages: Message[] | {};
  error?: string;
}

interface PreviousChatProps {
  messages?: Message[] | {};
}

export default function PreviousChat({
  messages: initialMessages = [],
}: PreviousChatProps) {
  const [messages, setMessages] = useState<Message[]>(
    Array.isArray(initialMessages) ? initialMessages : []
  );
  const [loading, setLoading] = useState(messages.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [dataFetched, setDataFetched] = useState(false);

  const { conversation_id } = useParams<{ conversation_id: string }>();
  const navigate = useNavigate();
  const { user_uuid, auth_key } = useUserStore();

  useEffect(() => {
    const fetchPreviousChat = async () => {
      if (!user_uuid || !auth_key || !conversation_id) {
        setError('User information or conversation ID is missing.');
        setLoading(false);
        return;
      }

      try {
        const response: ApiResponse = await Utils.post('/api/GetPreviousChat', {
          user_uuid,
          auth_key,
          page: 1,
          limit: 32,
          Type: 'GetPreviousChat',
          conversation_id,
        });

        if (response.error) {
          setError(response.error);
        } else if (Array.isArray(response.messages)) {
          setMessages(response.messages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error('Failed to fetch previous chat:', error);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
        setDataFetched(true);
      }
    };

    if (!dataFetched) {
      fetchPreviousChat();
    }
  }, [conversation_id, user_uuid, auth_key, dataFetched]);

  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [conversation_id]);

  const truncateMessage = (text: string, maxLength = 50) => {
    if (!text) return 'No message content';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const handleMessageClick = (conversation_id: string) => {
    navigate(`/chat/${conversation_id}`);
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
        ) : messages.length === 0 ? (
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
          messages.slice(0, 11).map((message) => (
            <motion.div
              key={message.id}
              data-message-id={message.conversation_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-start space-x-4 p-4 border-b border-gray-700 cursor-pointer"
              onClick={() => handleMessageClick(message.conversation_id)}
            >
              <Avatar
                src={message.character_image_url}
                alt="Avatar"
                className="w-12 h-12"
              />
              <div className="flex-1">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className="break-words"
                >
                  {truncateMessage(message.message)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(message.created_at).toLocaleString()}
                </Typography>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </aside>
  );
}
