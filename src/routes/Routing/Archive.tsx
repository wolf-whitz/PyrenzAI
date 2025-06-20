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
import { Sidebar, MobileNav, CustomContextMenu } from '~/components';

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
  const [itemsToShow, setItemsToShow] = useState<number>(5);
  const [anchorPosition, setAnchorPosition] = useState<{ top: number; left: number } | null>(null);
  const [selectedChatUuid, setSelectedChatUuid] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => {
    setOpen(false);
  };

  const loadMore = () => {
    setItemsToShow((prevItemsToShow) => prevItemsToShow + 10);
  };

  const {
    chats,
    characters,
    isLoading,
    handleCardClick,
    handleDeleteChat,
    handlePinChat,
  } = useArchiveChatPageAPI(open, handleClose);

  const truncateMessage = (message: string, length: number) => {
    return message.length > length ? `${message.substring(0, length)}...` : message;
  };

  const handleCardPress = (event: React.MouseEvent<HTMLDivElement>, chatUuid: string) => {
    if (isMobile) {
      setAnchorPosition({ top: event.clientY, left: event.clientX });
      setSelectedChatUuid(chatUuid);
    } else {
      handleCardClick(chatUuid);
    }
  };

  const handleMenuClose = () => {
    setAnchorPosition(null);
    setSelectedChatUuid(null);
  };

  const handlePinClick = async () => {
    if (selectedChatUuid) {
      await handlePinChat(selectedChatUuid);
      handleMenuClose();
    }
  };

  const handleDeleteClick = async () => {
    if (selectedChatUuid) {
      await handleDeleteChat(selectedChatUuid);
      handleMenuClose();
    }
  };

  const handleChatClick = () => {
    if (selectedChatUuid) {
      handleCardClick(selectedChatUuid);
      handleMenuClose();
    }
  };

  const menuItems = [
    { label: 'Chat', action: handleChatClick },
    { label: 'Pin', action: handlePinClick },
    { label: 'Delete', action: handleDeleteClick },
  ];

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
                {chats.slice(0, itemsToShow).map((chat: Chat) => (
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
                      onCardClick={(e: React.MouseEvent<HTMLDivElement>) => handleCardPress(e, chat.chat_uuid)}
                      isPinned={chat.is_pinned}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {isSmallScreen ? truncateMessage(chat.preview_message, 50) : chat.preview_message}
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
          {anchorPosition && (
            <CustomContextMenu
              items={menuItems}
              onClose={handleMenuClose}
              anchorPosition={anchorPosition}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
