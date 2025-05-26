import React from 'react';
import { CircularProgress, Modal, IconButton, Typography } from '@mui/material';
import { useArchiveChatModalAPI } from '@api';
import { Chat } from '@shared-types/chatTypes';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { CustomContextMenu } from '@components';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import { PyrenzChatsCharacterCard } from '~/theme'; 

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
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    handleDeleteChat,
  } = useArchiveChatModalAPI(open, onClose);

 
  return (
    <Modal open={open} onClose={onClose}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-4 rounded-lg shadow-lg max-h-screen overflow-y-auto" style={{ width: 'auto', maxWidth: '400px' }}>
        <div>
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
                <div key={chat.chat_uuid}>
                  <div
                    className="cursor-pointer mb-4"
                  >
                    <PyrenzChatsCharacterCard
                      imageSrc={chat.preview_image}
                      characterName={characters[chat.char_uuid]}
                      onCardClick={() => handleCardClick(chat.chat_uuid)}
                      onDeleteClick={() => handleDeleteChat(chat.chat_uuid)}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {chat.preview_message}
                      </Typography>
                    </PyrenzChatsCharacterCard>
                  </div>
                </div>
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
        </div>
      </div>
    </Modal>
  );
}
