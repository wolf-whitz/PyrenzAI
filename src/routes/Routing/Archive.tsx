import React, { useState } from 'react';
import {
  CircularProgress,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useArchiveChatPageAPI } from '@api';
import { PyrenzChatsCharacterCard, PyrenzBlueButton } from '~/theme';
import { Sidebar, MobileNav } from '~/components';

export function Archive() {
  const [open, setOpen] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(5);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpen(false);
  };

  const loadMore = () => {
    setItemsToShow((prevItemsToShow) => prevItemsToShow + 5);
  };

  const {
    chats,
    characters,
    isLoading,
    handleCardClick,
    handleDeleteChat,
    handlePinChat,
  } = useArchiveChatPageAPI(open, handleClose);

  const handlePinClick = async (chatUuid: string) => {
    await handlePinChat(chatUuid);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Box sx={{ display: 'flex', flex: 1 }}>
        {!isMobile && <Sidebar />}
        {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}

        <Box sx={{ flex: 1, p: isMobile ? 2 : 4 }}>
          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : chats.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="52vh"
            >
              <Typography variant="h6" color="textSecondary">
                No chats left, maybe start a new one? {'(⸝⸝> ᴗ•⸝⸝)'}
              </Typography>
            </Box>
          ) : (
            <>
              <Box display="flex" flexWrap="wrap" justifyContent="center">
                {chats.slice(0, itemsToShow).map((chat) => (
                  <Box key={chat.chat_uuid} mx={2} mb={4} position="relative">
                    <PyrenzChatsCharacterCard
                      sx={{
                        transition:
                          'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: 6,
                        },
                      }}
                      imageSrc={chat.preview_image}
                      characterName={characters[chat.char_uuid]}
                      onCardClick={() => handleCardClick(chat.chat_uuid)}
                      onDeleteClick={() => handleDeleteChat(chat.chat_uuid)}
                      onPinClick={() => handlePinClick(chat.chat_uuid)}
                      isPinned={chat.is_pinned}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {chat.preview_message}
                      </Typography>
                    </PyrenzChatsCharacterCard>
                  </Box>
                ))}
              </Box>
              {itemsToShow < chats.length && (
                <Box display="flex" justifyContent="center" mt={2}>
                  <PyrenzBlueButton onClick={loadMore}>
                    Load More
                  </PyrenzBlueButton>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
