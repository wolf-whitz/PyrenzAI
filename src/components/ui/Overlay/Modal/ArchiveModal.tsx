import React from 'react';
import { CircularProgress, Modal, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import {
  PyrenzChatsCharacterCard,
  PyrenzCardImage,
  PyrenzCardContent,
  PyrenzCardName,
} from '~/theme';
import { useArchiveChatModalAPI } from '@api'; 
import { Chat } from '@shared-types/chatTypes'
import { Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { CustomContextMenu } from '@components';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';

interface ArchiveModalProps {
  open: boolean;
  onClose: () => void;
}

export function ArchiveModal({ open, onClose }: ArchiveModalProps) {
  const {
    chats,
    characters,
    isLoading,
    handleCardClick,
    handleContextMenu,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    contextMenuAnchor,
    selectedChat,
    handleDeleteChat,
    setContextMenuAnchor,
    setSelectedChat,
  } = useArchiveChatModalAPI(open, onClose);

  const handleCardPress = (event: React.MouseEvent, chat: Chat) => {
    event.preventDefault();
    setContextMenuAnchor({
      top: event.clientY + 2,
      left: event.clientX - 6,
    });
    setSelectedChat(chat);
  };

  const menuItems = [
    {
      label: 'Chat',
      action: () => {
        if (selectedChat) {
          handleCardClick(selectedChat.chat_uuid);
        }
      },
      icon: <ChatIcon />,
    },
    {
      label: 'Delete',
      action: () => {
        if (selectedChat) {
          handleDeleteChat(selectedChat.chat_uuid);
        }
      },
      icon: <DeleteIcon />,
    },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-4 rounded-lg shadow-lg max-h-screen overflow-y-auto" style={{ width: 'auto', maxWidth: '400px' }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5 } },
          }}
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <CircularProgress />
            </div>
          ) : chats.length === 0 ? (
            <div className="flex justify-center items-center h-52">
              <Typography variant="h6" color="textSecondary">
                No chats left, maybe start a new one? (⸝⸝&gt; ᴗ•⸝⸝)
              </Typography>
            </div>
          ) : (
            <>
              {chats.slice(currentPage * 5, currentPage * 5 + 5).map((chat) => (
                <motion.div
                  key={chat.chat_uuid}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 },
                  }}
                >
                  <motion.div
                    onClick={(e) => handleCardPress(e, chat)}
                    onContextMenu={(e) => handleContextMenu(e, chat)}
                    className="cursor-pointer mb-4"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0px 10px 20px rgba(0,0,0,0.1)',
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <PyrenzChatsCharacterCard>
                      <PyrenzCardImage>
                        <img src={chat.preview_image} alt="Preview" />
                      </PyrenzCardImage>
                      <PyrenzCardContent>
                        <PyrenzCardName>
                          {characters[chat.char_uuid]}
                        </PyrenzCardName>
                        <Typography variant="body2" color="text.secondary">
                          {chat.preview_message}
                        </Typography>
                      </PyrenzCardContent>
                    </PyrenzChatsCharacterCard>
                  </motion.div>
                </motion.div>
              ))}
              <div className="flex justify-between mt-4">
                <IconButton onClick={goToPreviousPage} disabled={currentPage === 0}>
                  <ChevronLeftIcon />
                </IconButton>
                <span>
                  Page {currentPage + 1} of {totalPages}
                </span>
                <IconButton onClick={goToNextPage} disabled={currentPage === totalPages - 1}>
                  <ChevronRightIcon />
                </IconButton>
              </div>
            </>
          )}
          {contextMenuAnchor && selectedChat && (
            <CustomContextMenu
              items={menuItems}
              anchorPosition={contextMenuAnchor}
              onClose={() => setContextMenuAnchor(null)}
            />
          )}
        </motion.div>
      </div>
    </Modal>
  );
}
