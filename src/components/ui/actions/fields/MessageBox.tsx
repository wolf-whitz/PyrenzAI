import React, { useState, useEffect, useRef } from 'react';
import { Box, useTheme } from '@mui/material';
import { MessageContextMenu } from '~/components';
import { PyrenzMessageBox, PyrenzDialog } from '~/theme';
import type { MessageBoxProps } from '@shared-types';

export function MessageBox(
  props: MessageBoxProps & { alternation_first?: boolean }
) {
  const {
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
    onGenerateImage,
    alternation_first = true,
  } = props;

  const role = msg.type; // 'user' | 'char'
  const displayName =
    role === 'user' ? msg.username || user.username : msg.name || char.name;

  const isEditingThisMessage =
    editingMessageId === msg.id && editingMessageType === role;

  const [localEditedMessage, setLocalEditedMessage] = useState(msg.text || '');
  const [debouncedValue, setDebouncedValue] = useState(localEditedMessage);
  const [openDialog, setOpenDialog] = useState(false);

  const alternatives = msg.alternative_messages ?? [];
  if (msg.text && !alternatives.includes(msg.text)) {
    alternatives.unshift(msg.text);
  }

  const totalMessages = alternatives.length;
  const prevMsgIdRef = useRef<string | number | undefined>(msg.id);

  const [altIndex, setAltIndex] = useState(
    alternation_first ? 0 : totalMessages > 0 ? totalMessages - 1 : 0
  );

  useEffect(() => {
    if (msg.id !== prevMsgIdRef.current) {
      setLocalEditedMessage(msg.text || '');
      setAltIndex(
        alternation_first
          ? 0
          : alternatives.length > 0
          ? alternatives.length - 1
          : 0
      );
      prevMsgIdRef.current = msg.id;
    }
  }, [msg.id, alternation_first, alternatives.length, msg.text]);

  useEffect(() => {
    if (!isEditingThisMessage) return;
    const timer = setTimeout(() => setDebouncedValue(localEditedMessage), 500);
    return () => clearTimeout(timer);
  }, [localEditedMessage, isEditingThisMessage]);

  useEffect(() => {
    if (altIndex >= totalMessages) setAltIndex(0);
  }, [totalMessages, altIndex]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAltIndex((prev) => (prev === 0 ? totalMessages - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAltIndex((prev) => (prev + 1) % totalMessages);
  };

  const currentText = alternatives[altIndex] ?? '';
  const isEmptyCharMessage =
    role === 'char' && isLastMessage && currentText.trim() === '';

  const theme = useTheme();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const handleMessageBoxClick = (e: React.MouseEvent) => {
    if (!isEditingThisMessage && index !== 0 && !isGenerating) {
      setMenuPosition({ top: e.clientY, left: e.clientX });
    }
  };

  const handleCloseMenu = () => setMenuPosition(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        e.target instanceof Node &&
        !menuRef.current.contains(e.target)
      ) {
        handleCloseMenu();
      }
    };
    if (menuPosition) {
      document.addEventListener('mousedown', onOutside);
    } else {
      document.removeEventListener('mousedown', onOutside);
    }
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
      key={msg.id ?? `temp-${index}`}
      display="flex"
      alignItems="flex-start"
      justifyContent={role === 'user' ? 'flex-end' : 'flex-start'}
      sx={{ mb: 2, width: '100%', position: 'relative' }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '90%', sm: '80%' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: role === 'user' ? 'flex-end' : 'flex-start',
        }}
      >
        <PyrenzMessageBox
          onClick={handleMessageBoxClick}
          role={role}
          content={msg.text}
          displayName={displayName}
          userAvatar={user.user_avatar}
          charAvatar={char.profile_image}
          isEditing={isEditingThisMessage}
          localEditedMessage={localEditedMessage}
          onChange={(e) => setLocalEditedMessage(e.target.value)}
          onSaveEdit={() =>
            msg.id && onSaveEdit(msg.id, debouncedValue, role)
          }
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
          alternation_first={alternation_first}
          sx={{
            cursor: 'pointer',
            width: isEditingThisMessage ? '100%' : 'fit-content',
            maxWidth: '100%',
          }}
        />
      </Box>

      {menuPosition &&
        !isEditingThisMessage &&
        index !== 0 &&
        !isGenerating && (
          <Box
            ref={menuRef}
            sx={{
              position: 'fixed',
              top: menuPosition.top,
              left: menuPosition.left,
              zIndex: 1300,
              bgcolor: theme.palette.background.paper,
              borderRadius: 1,
              boxShadow: 3,
            }}
          >
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
}
