import React, { useState } from 'react';
import {
  CircularProgress,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useArchiveChatPageAPI } from '@api';
import { PyrenzChatsCharacterCard } from '~/theme';
import { Sidebar, MobileNav } from '~/components';

export function Archive() {
  const [open, setOpen] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleClose = () => {
    setOpen(false);
  };

  const {
    chats,
    characters,
    isLoading,
    handleCardClick,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    handleDeleteChat,
  } = useArchiveChatPageAPI(open, handleClose);

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
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={4}
              >
                <IconButton
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  sx={{
                    '&:hover': {
                      '& .MuiSvgIcon-root': {
                        animation: 'moveLeft 0.6s ease-in-out',
                      },
                    },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                <Typography>
                  Page {currentPage + 1} of {totalPages}
                </Typography>
                <IconButton
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  sx={{
                    '&:hover': {
                      '& .MuiSvgIcon-root': {
                        animation: 'moveRight 0.6s ease-in-out',
                      },
                    },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </Box>
              <style>
                {`
                  @keyframes moveLeft {
                    0%, 100% {
                      transform: translateX(0);
                    }
                    50% {
                      transform: translateX(-5px);
                    }
                  }
                  @keyframes moveRight {
                    0%, 100% {
                      transform: translateX(0);
                    }
                    50% {
                      transform: translateX(5px);
                    }
                  }
                `}
              </style>
              <Box display="flex" flexWrap="wrap" justifyContent="center">
                {chats
                  .slice(currentPage * 5, currentPage * 5 + 5)
                  .map((chat) => (
                    <Box key={chat.chat_uuid} mx={2} mb={4}>
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
                      >
                        <Typography variant="body2" color="text.secondary">
                          {chat.preview_message}
                        </Typography>
                      </PyrenzChatsCharacterCard>
                    </Box>
                  ))}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
