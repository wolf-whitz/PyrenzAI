import React, { useState } from 'react';
import {
  CircularProgress,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { PyrenzChatsCharacterCard, PyrenzBlueButton } from '~/theme';
import { Sidebar, MobileNav, useArchiveChatPageAPI } from '@components';

interface Chat {
  chat_uuid: string;
  preview_image: string;
  preview_message: string;
  char_uuid: string;
  is_pinned: boolean;
}

export function Archive() {
  const [open, setOpen] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [itemsToShow, setItemsToShow] = useState<number>(30);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpen(false);
  };

  const {
    chats,
    characters,
    isLoading,
    handleCardClick: handleChatSend,
    handleDeleteChat,
    handlePinChat,
    totalPages,
    currentPage,
    goToNextPage,
    goToPreviousPage,
  } = useArchiveChatPageAPI(open, handleClose, itemsToShow);

  const truncateMessage = (message: string, length: number) => {
    return message.length > length
      ? `${message.substring(0, length)}...`
      : message;
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
        <Box sx={{ flex: 1, p: isMobile ? 2 : 4, mb: isMobile ? '56px' : 0 }}>
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
                {chats.map((chat: Chat) => (
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
                      ChatSend={() => handleChatSend(chat.chat_uuid)}
                      onPinClick={() => handlePinChat(chat.chat_uuid)}
                      onDeleteClick={() => handleDeleteChat(chat.chat_uuid)}
                      isPinned={chat.is_pinned}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {isMobile
                          ? truncateMessage(chat.preview_message, 50)
                          : chat.preview_message}
                      </Typography>
                    </PyrenzChatsCharacterCard>
                  </Box>
                ))}
              </Box>
              <Box
                display="flex"
                justifyContent="center"
                mt={2}
                alignItems="center"
              >
                <PyrenzBlueButton
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  sx={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <NavigateBeforeIcon />
                </PyrenzBlueButton>
                <Box mx={2}>
                  <Typography variant="body1">
                    Page {currentPage + 1} of {totalPages}
                  </Typography>
                </Box>
                <PyrenzBlueButton
                  onClick={goToNextPage}
                  disabled={currentPage >= totalPages - 1}
                  sx={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <NavigateNextIcon />
                </PyrenzBlueButton>
              </Box>
            </>
          )}
        </Box>
      </Box>
      {isMobile && <MobileNav setShowLoginModal={setShowLoginModal} />}
    </Box>
  );
}
