import React, { useState, useEffect, useRef } from 'react';
import {
  TypingIndicator,
  CustomMarkdown,
  MessageContextMenu,
} from '@components';
import { Box, useTheme } from '@mui/material';
import { PyrenzMessageBox, PyrenzDialog } from '~/theme';
import type { MessageBoxProps } from '@shared-types';

export const MessageBox = React.memo(function MessageBox({
  msg,
  index,
  isGenerating,
  isLastMessage,
  user,
  char,
  onRegenerate,
  onRemove,
  handleSpeak,
  editingMessageId,
  editingMessageType,
  isLoading,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
}: MessageBoxProps) {
  const dataState = msg.type;
  const displayName =
    dataState === 'user'
      ? msg.username || user.username
      : msg.name || char.name;
  const isEditingThisMessage =
    editingMessageId === msg.id && editingMessageType === dataState;

  const [localEditedMessage, setLocalEditedMessage] = useState(msg.text || '');
  const [debouncedValue, setDebouncedValue] = useState(localEditedMessage);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setLocalEditedMessage(msg.text || '');
  }, [msg.text]);

  useEffect(() => {
    if (!isEditingThisMessage) return;

    const handler = setTimeout(() => {
      setDebouncedValue(localEditedMessage);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [localEditedMessage, isEditingThisMessage]);

  const theme = useTheme();
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMessageBoxClick = (event: React.MouseEvent) => {
    if (!isEditingThisMessage && index !== 0) {
      setMenuPosition({ top: event.clientY, left: event.clientX });
    }
  };

  const handleCloseMenu = () => {
    setMenuPosition(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    if (menuPosition) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuPosition]);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text || '');
    handleCloseMenu();
  };

  const handleSaveEdit = () => {
    if (msg.id) {
      onSaveEdit(msg.id, debouncedValue, dataState);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    if (msg.id) {
      onRemove(msg.id);
    }
    setOpenDialog(false);
  };

  if (!msg.id && !isGenerating) return null;

  return (
    <Box
      key={msg.id ? `${msg.id}-${index}` : `temp-${index}`}
      display="flex"
      alignItems="flex-start"
      justifyContent={dataState === 'user' ? 'flex-end' : 'flex-start'}
      sx={{ position: 'relative', width: '100%', mb: 2 }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems={dataState === 'user' ? 'flex-end' : 'flex-start'}
        sx={{
          width: '100%',
          maxWidth: '80%',
          '@media (max-width: 600px)': {
            maxWidth: '90%',
          },
        }}
      >
        <PyrenzMessageBox
          onClick={handleMessageBoxClick}
          dataState={dataState}
          displayName={displayName}
          userAvatar={user.user_avatar}
          charAvatar={char.profile_image}
          isEditing={isEditingThisMessage}
          localEditedMessage={localEditedMessage}
          onChange={(e) => setLocalEditedMessage(e.target.value)}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={onCancelEdit}
          isLoading={isLoading}
          sx={{
            p: 2,
            borderRadius: '8px',
            boxShadow: 1,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            cursor: 'pointer',
            width: isEditingThisMessage ? '100%' : 'fit-content',
            maxWidth: '100%',
          }}
        >
          {isGenerating &&
          dataState === 'char' &&
          isLastMessage &&
          !msg.text ? (
            <TypingIndicator />
          ) : (
            <CustomMarkdown
              text={msg.text || ''}
              char={char}
              dataState={dataState}
            />
          )}
        </PyrenzMessageBox>
      </Box>

      {menuPosition && !isEditingThisMessage && index !== 0 && (
        <Box
          ref={menuRef}
          sx={{
            position: 'fixed',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            zIndex: 1300,
            backgroundColor: theme.palette.background.paper,
            borderRadius: '8px',
            boxShadow: 3,
          }}
        >
          <MessageContextMenu
            msg={msg}
            onRegenerate={onRegenerate}
            onRemove={handleOpenDialog}
            handleSpeak={handleSpeak}
            onEditClick={onEditClick}
            handleCopy={handleCopy}
            onClose={handleCloseMenu}
          />
        </Box>
      )}

      <PyrenzDialog
        open={openDialog}
        onClose={handleCloseDialog}
        title="Confirm Deletion"
        content="Are you sure you want to delete this message? This will also remove all messages below it."
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
});
