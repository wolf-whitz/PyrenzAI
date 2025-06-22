import React, { useState } from 'react';
import {
  Avatar,
  CircularProgress,
  Typography,
  Box,
  Button,
  IconButton,
  Popover,
  MenuItem,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion } from 'framer-motion';
import { usePreviousChatAPI } from '@api';
import { PyrenzDialog } from '~/theme';

export function PreviousChat() {
  const {
    chats,
    isInitialLoading,
    loading,
    error,
    handleMessageClick,
    handleDelete,
    truncateMessage,
    loadMore,
    hasMore,
  } = usePreviousChatAPI();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedChatUuid, setSelectedChatUuid] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, chatUuid: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedChatUuid(chatUuid);
  };

  const handleConfirmDelete = () => {
    if (selectedChatUuid) {
      handleDelete(selectedChatUuid);
    }
    setDialogOpen(false);
    setAnchorEl(null);
    setSelectedChatUuid(null);
  };

  const handleCancelDelete = () => {
    setDialogOpen(false);
  };

  return (
    <Box component="aside" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: { xs: 'none', lg: 'flex' }, flex: 1, p: 2, width: 256 }}>
        <Box
          sx={{
            borderRadius: 2,
            bgcolor: 'rgba(30,30,40,0.4)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            minHeight: 500,
            maxHeight: 700,
          }}
        >
          {isInitialLoading ? (
            <Box sx={{ flex: 1, p: 2, textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="body2" color="textSecondary">
                Loading previous chats...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ flex: 1, p: 2, textAlign: 'center' }}>
              <motion.img
                src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MascotCrying.avif"
                alt="Crying Mascot"
                style={{ width: 96, height: 96 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              />
              <Typography variant="body2" color="textSecondary">
                {error}
              </Typography>
            </Box>
          ) : chats.length === 0 ? (
            <Box sx={{ flex: 1, p: 2, textAlign: 'center' }}>
              <motion.img
                src="https://cqtbishpefnfvaxheyqu.supabase.co/storage/v1/object/public/character-image/CDN/MascotCrying.avif"
                alt="Crying Mascot"
                style={{ width: 96, height: 96 }}
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
                  key={chat.chat_uuid}
                  data-chat-id={chat.chat_uuid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      flex: 1,
                    }}
                    onClick={() => handleMessageClick(chat.chat_uuid)}
                  >
                    <Avatar
                      src={chat.preview_image}
                      alt="Chat preview"
                      sx={{ width: 48, height: 48 }}
                    />
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ wordBreak: 'break-word' }}
                    >
                      {truncateMessage(chat.preview_message)}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, chat.chat_uuid)}
                    sx={{ color: 'white' }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </motion.div>
              ))}
              {hasMore && (
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  sx={{ m: 2, alignSelf: 'center', color: 'white' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Load More'}
                </Button>
              )}
            </Box>
          )}
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => {
              setAnchorEl(null);
              setSelectedChatUuid(null);
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={() => {
              setDialogOpen(true);
              setAnchorEl(null);
            }}>
              Delete
            </MenuItem>
          </Popover>
        </Box>
      </Box>
      <PyrenzDialog
        open={dialogOpen}
        onClose={handleCancelDelete}
        title="Confirm Deletion"
        content="Are you sure you want to delete this chat?"
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
