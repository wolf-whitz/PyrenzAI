import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Avatar, CircularProgress, Typography, Box } from '@mui/material';
import { usePreviousChatAPI } from '@api';
import { CustomContextMenu } from '~/components/ui/Actions/ContextMenu/CustomContextMenu';

export function PreviousChat() {
  const {
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
  } = usePreviousChatAPI();

  return (
    <Box component="aside" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: { xs: 'none', lg: 'flex' }, flex: 1, padding: '16px', width: '256px' }}>
        <Box sx={{
          borderRadius: '12px',
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          minHeight: '500px', 
          maxHeight: '700px', 
        }}>
          {loading ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              gap: '16px',
              flex: 1
            }}>
              <CircularProgress />
              <Typography variant="body2" color="textSecondary">
                Loading previous chats...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              gap: '16px',
              flex: 1
            }}>
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
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              gap: '16px',
              flex: 1
            }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {chats.map((chat) => (
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
              ))}
            </Box>
          )}
          {contextMenu && (
            <Suspense>
              <CustomContextMenu
                items={[
                  { label: 'Export', action: () => handleExport(contextMenu.chatId) },
                  { label: 'Delete', action: () => handleDelete(contextMenu.chatId) },
                ]}
                onClose={handleClose}
                anchorPosition={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
              />
            </Suspense>
          )}
        </Box>
      </Box>
    </Box>
  );
}
