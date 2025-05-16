import React, { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Avatar, CircularProgress, Typography, Box } from '@mui/material';
import { supabase } from '~/Utility/supabaseClient';
import { GetUserUUID } from '~/functions';

const CustomContextMenu = lazy(() => import('@components/index').then(module => ({ default: module.CustomContextMenu })));

interface Chat {
  id: string;
  chat_uuid: string;
  preview_message: string;
  created_at: string;
  preview_image: string;
}

export function PreviousChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    chatId: string | null;
  } | null>(null);

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
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(chatToExport))}`;
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

  return (
    <Box
      sx={{
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '256px',
        padding: '16px',
        height: '100%',
      }}
    >
      <Box
        sx={{
          borderRadius: '12px',
          width: '100%',
          backgroundColor: 'background.paper',
          flexGrow: 1,
          overflow: 'auto',
          minHeight: '200px',
          maxHeight: '400px',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              gap: '16px',
            }}
          >
            <CircularProgress />
            <Typography variant="body2" color="textSecondary">
              Loading previous chats...
            </Typography>
          </Box>
        ) : error ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              gap: '16px',
            }}
          >
            <motion.img
              src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MascotCrying.avif"
              alt="Crying Mascot"
              style={{ width: '96px', height: '96px', marginTop: '8px' }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <Typography variant="body2" color="textSecondary">
              {error}
            </Typography>
          </Box>
        ) : chats.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              gap: '16px',
            }}
          >
            <motion.img
              src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MascotCrying.avif"
              alt="Crying Mascot"
              style={{ width: '96px', height: '96px', marginTop: '12px' }}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            <Typography variant="body2" color="textSecondary">
              No chats to load. Start a new conversation!
            </Typography>
          </Box>
        ) : (
          chats.slice(0, 11).map((chat) => (
            <motion.div
              key={chat.id}
              data-chat-id={chat.chat_uuid}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                padding: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer',
              }}
              onClick={() => handleMessageClick(chat.chat_uuid)}
              onContextMenu={(e) => handleContextMenu(e, chat.id)}
              onMouseDown={(e) => handleMouseDown(e, chat.id)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <Avatar
                src={chat.preview_image}
                alt="Chat preview"
                sx={{ width: '48px', height: '48px' }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ wordBreak: 'break-word' }}
                >
                  {truncateMessage(chat.preview_message)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(chat.created_at).toLocaleString()}
                </Typography>
              </Box>
            </motion.div>
          ))
        )}
        {contextMenu && (
          <Suspense>
            <CustomContextMenu
              items={[
                {
                  label: 'Export',
                  action: () => handleExport(contextMenu.chatId),
                },
                {
                  label: 'Delete',
                  action: () => handleDelete(contextMenu.chatId),
                },
              ]}
              onClose={handleClose}
              anchorPosition={{
                top: contextMenu.mouseY,
                left: contextMenu.mouseX,
              }}
            />
          </Suspense>
        )}
      </Box>
    </Box>
  );
}
