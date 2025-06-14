import React, { useState, useEffect, useRef } from 'react';
import {
  TypingIndicator,
  CustomMarkdown,
  MessageContextMenu,
} from '@components';
import {
  Box,
  Avatar,
  TextField,
  useTheme,
} from '@mui/material';
import { PyrenzMessageBox, PyrenzBlueButton } from '~/theme';
import type { Message, User, Character } from '@shared-types';

interface MessageBoxProps {
  msg: Message;
  index: number;
  isGenerating: boolean;
  isLastMessage: boolean;
  user: User;
  char: Character;
  onRegenerate: (messageId: string) => void;
  onRemove: (messageId: string) => void;
  onEditMessage: (
    messageId: string,
    editedMessage: string,
    type: 'user' | 'char'
  ) => void;
  handleSpeak: (text: string) => void;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  editingMessageId: string | null;
  editingMessageType: 'user' | 'char' | null;
  editedMessage: string;
  isLoading: boolean;
  onEditClick: (
    messageId: string,
    currentMessage: string,
    type: 'user' | 'char'
  ) => void;
  onSaveEdit: (messageId: string, type: 'user' | 'char') => void;
  onCancelEdit: () => void;
  setEditedMessage: (message: string) => void;
}

export function MessageBox({
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
  editedMessage,
  isLoading,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
  setEditedMessage,
}: MessageBoxProps) {
  const isUser = msg.type === 'user';
  const isAssistant = msg.type === 'assistant';

  const displayName = isUser ? msg.username || user.username : msg.name || char.name;

  const isEditingThisMessage =
    editingMessageId === msg.id &&
    editingMessageType === (isUser ? 'user' : 'char');

  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMessageBoxClick = (event: React.MouseEvent) => {
    if (!isEditingThisMessage) {
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

  const theme = useTheme();

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text || '');
    handleCloseMenu();
  };

  if (!msg.id && !isGenerating) return null;

  return (
    <Box
      key={msg.id ? `${msg.id}-${index}` : `temp-${index}`}
      display="flex"
      alignItems="flex-start"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      sx={{ position: 'relative', width: '100%', mb: 2 }}
    >
      {!isUser && (
        <Avatar
          alt={displayName}
          src={char.profile_image}
          sx={{ width: 32, height: 32, mr: 1 }}
          className="rounded-full"
        />
      )}

      <Box
        display="flex"
        flexDirection="column"
        alignItems={isUser ? 'flex-end' : 'flex-start'}
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
          className={isUser ? 'user' : 'other'}
        >
          {isGenerating && isAssistant && isLastMessage && !msg.text && (
            <TypingIndicator />
          )}

          {isEditingThisMessage ? (
            <Box display="flex" flexDirection="column" width="100%">
              <TextField
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                autoFocus
                multiline
                fullWidth
                minRows={3}
                maxRows={20}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    padding: '8px',
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                  '& textarea': {
                    overflow: 'auto',
                  },
                }}
              />
              <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                <PyrenzBlueButton
                  onClick={() => msg.id && onSaveEdit(msg.id, isUser ? 'user' : 'char')}
                  disabled={isLoading}
                  sx={{ backgroundColor: 'transparent' }}
                >
                  {isLoading ? 'Saving...' : 'Submit'}
                </PyrenzBlueButton>
                <PyrenzBlueButton
                  onClick={onCancelEdit}
                  disabled={isLoading}
                  sx={{ backgroundColor: 'transparent' }}
                >
                  Cancel
                </PyrenzBlueButton>
              </Box>
            </Box>
          ) : (
            <CustomMarkdown text={msg.text || ''} user={user} char={char} />
          )}
        </PyrenzMessageBox>
      </Box>

      {isUser && (
        <Avatar
          alt={displayName}
          src={user.user_avatar}
          sx={{ width: 32, height: 32, ml: 1 }}
          className="rounded-full"
        />
      )}

      {menuPosition && !isEditingThisMessage && (
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
            onRemove={onRemove}
            handleSpeak={handleSpeak}
            onEditClick={onEditClick}
            handleCopy={handleCopy}
            onClose={handleCloseMenu}
          />
        </Box>
      )}
    </Box>
  );
}
