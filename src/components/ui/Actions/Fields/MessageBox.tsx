import React, { useState, useEffect, useRef } from 'react';
import { MessageContextMenu } from '~/components';
import { Box, useTheme } from '@mui/material';
import { PyrenzMessageBox, PyrenzDialog } from '~/theme';
import type { MessageBoxProps } from '@shared-types';

export const MessageBox: React.FC<MessageBoxProps> = React.memo(({
  msg, index, isGenerating, isLastMessage, user, char,
  onRegenerate, onRemove, handleSpeak,
  editingMessageId, editingMessageType, isLoading,
  onEditClick, onSaveEdit, onCancelEdit, onGenerateImage,
}) => {
  const dataState = msg.type;
  const displayName = dataState === 'user'
    ? msg.username || user.username
    : msg.name || char.name;

  const isEditingThisMessage = editingMessageId === msg.id && editingMessageType === dataState;

  const [localEditedMessage, setLocalEditedMessage] = useState(msg.text || '');
  const [debouncedValue, setDebouncedValue] = useState(localEditedMessage);
  const [openDialog, setOpenDialog] = useState(false);
  const [altIndex, setAltIndex] = useState(0);

  const alternatives = msg.alternative_messages?.length
    ? msg.alternative_messages
    : msg.text
      ? [msg.text]
      : [];
  const totalMessages = alternatives.length;

  useEffect(() => {
    setLocalEditedMessage(msg.text || '');
    setAltIndex(0);
  }, [msg.text, msg.alternative_messages]);

  useEffect(() => {
    if (!isEditingThisMessage) return;
    const timer = setTimeout(() => setDebouncedValue(localEditedMessage), 500);
    return () => clearTimeout(timer);
  }, [localEditedMessage, isEditingThisMessage]);

  useEffect(() => {
    if (altIndex >= alternatives.length) setAltIndex(0);
  }, [totalMessages, altIndex]);

  const handlePrev = (e: React.MouseEvent) => { e.stopPropagation(); setAltIndex(prev => (prev === 0 ? totalMessages - 1 : prev - 1)); };
  const handleNext = (e: React.MouseEvent) => { e.stopPropagation(); setAltIndex(prev => (prev + 1) % totalMessages); };

  const currentText = alternatives[altIndex] ?? '';
  const isEmptyCharMessage = dataState === 'char' && isLastMessage && currentText.trim() === '';

  const theme = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number, left: number } | null>(null);

  const handleMessageBoxClick = (e: React.MouseEvent) => {
    if (!isEditingThisMessage && index !== 0) {
      setMenuPosition({ top: e.clientY, left: e.clientX });
    }
  };
  const handleCloseMenu = () => setMenuPosition(null);
  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) handleCloseMenu();
    };
    if (menuPosition) document.addEventListener('mousedown', onOutside);
    else document.removeEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [menuPosition]);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text || '');
    handleCloseMenu();
  };
  const handleConfirmDelete = () => {
    if (msg.id) onRemove(msg.id);
    setOpenDialog(false);
  };

  if (!msg.id && !isGenerating) return null;

  return (
    <Box
      key={msg.id ? `${msg.id}-${altIndex}` : `temp-${index}-${altIndex}`}
      display="flex"
      alignItems="flex-start"
      justifyContent={dataState === 'user' ? 'flex-end' : 'flex-start'}
      sx={{ mb: 2, width: '100%', position: 'relative' }}
    >
      <Box sx={{ width: '100%', maxWidth: { xs: '90%', sm: '80%' }, display: 'flex', flexDirection: 'column', alignItems: dataState === 'user' ? 'flex-end' : 'flex-start' }}>
        <PyrenzMessageBox
          onClick={handleMessageBoxClick}
          dataState={dataState}
          displayName={displayName}
          userAvatar={user.user_avatar}
          charAvatar={char.profile_image}
          isEditing={isEditingThisMessage}
          localEditedMessage={localEditedMessage}
          onChange={e => setLocalEditedMessage(e.target.value)}
          onSaveEdit={() => msg.id && onSaveEdit(msg.id, debouncedValue, dataState)}
          onCancelEdit={onCancelEdit}
          isLoading={isLoading}
          onGoPrev={handlePrev}
          onGoNext={handleNext}
          showNav={totalMessages > 1}
          currentMessageIndex={altIndex}
          alternativeMessages={alternatives}
          isGeneratingEmptyCharMessage={isEmptyCharMessage}
          ai_message={currentText}
          char={char}
          sx={{ cursor: 'pointer', width: isEditingThisMessage ? '100%' : 'fit-content', maxWidth: '100%' }}
        >
          {currentText}
        </PyrenzMessageBox>
      </Box>

      {menuPosition && !isEditingThisMessage && index !== 0 && (
        <Box ref={menuRef} sx={{
          position: 'fixed',
          top: menuPosition.top,
          left: menuPosition.left,
          zIndex: 1300,
          bgcolor: theme.palette.background.paper,
          borderRadius: 1,
          boxShadow: 3
        }}>
          <MessageContextMenu
            msg={msg}
            onRegenerate={() => msg.id && onRegenerate(msg.id)}
            onRemove={() => setOpenDialog(true)}
            handleSpeak={handleSpeak}
            onEditClick={onEditClick}
            handleCopy={handleCopy}
            onGenerateImage={onGenerateImage}
            onClose={handleCloseMenu}
          />
        </Box>
      )}

      <PyrenzDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        title="Confirm Deletion"
        content="Are you sure you want to delete this and everything below?"
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
});
