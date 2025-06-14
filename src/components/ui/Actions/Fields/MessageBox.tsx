import React from 'react';
import { TypingIndicator, CustomMarkdown, MessageContextMenu } from '@components';
import { Box, Avatar, TextField } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
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

export const MessageBox = ({
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
  setEditedMessage
}: MessageBoxProps) => {
  const isUser = msg.type === 'user';
  const isAssistant = msg.type === 'assistant';
  const isFirstMessage = index === 0;

  const displayName = isUser ? msg.username || user.username : msg.name || char.name;

  const isEditingThisMessage =
    editingMessageId === msg.id &&
    editingMessageType === (isUser ? 'user' : 'char');

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.text || '');
  };

  return (
    <Box
      key={msg.id ? `${msg.id}-${index}` : `temp-${index}`}
      display="flex"
      alignItems="start"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      sx={{ position: 'relative' }}
    >
      {!isUser && !isGenerating && !msg.error && (
        <Avatar
          alt={displayName}
          src={char.profile_image}
          sx={{ width: 32, height: 32 }}
          className="rounded-full"
        />
      )}

      <Box display="flex" flexDirection="row" alignItems="flex-start">
        <PyrenzMessageBox
          sx={{
            marginLeft: isAssistant ? 2 : 0,
            marginRight: isUser ? 2 : 0,
            position: 'relative',
            width: '100%'
          }}
          className={isUser ? 'user' : 'other'}
        >
          {isGenerating && isAssistant && isLastMessage && !msg.text && (
            <TypingIndicator />
          )}
          {isEditingThisMessage ? (
            <Box display="flex" flexDirection="column">
              <TextField
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                autoFocus
                multiline
                fullWidth
                minRows={2}
                sx={{
                  background: 'transparent',
                  resize: 'vertical',
                  width: '500px',
                  maxWidth: '100%',
                  '& .MuiOutlinedInput-root': {
                    padding: '8px',
                    '& fieldset': {
                      border: 'none'
                    }
                  }
                }}
              />
              <Box display="flex" justifyContent="space-between" mt={1}>
                <PyrenzBlueButton
                  onClick={() =>
                    msg.id && onSaveEdit(msg.id, isUser ? 'user' : 'char')
                  }
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

        {!isFirstMessage && !isGenerating && !msg.error && (
          <Box ml={1}>
            <MessageContextMenu
              isUser={isUser}
              isAssistant={isAssistant}
              isFirstMessage={isFirstMessage}
              isGenerating={isGenerating}
              msg={msg}
              onRegenerate={onRegenerate}
              onRemove={onRemove}
              handleSpeak={handleSpeak}
              onEditClick={onEditClick}
              handleCopy={handleCopy}
            />
          </Box>
        )}
      </Box>

      {isUser && !msg.error && (
        <Avatar
          alt={displayName}
          src={user.user_avatar}
          sx={{ width: 32, height: 32 }}
          className="rounded-full"
        />
      )}

      {!isGenerating && msg.error && (
        <Box display="flex" alignItems="center" ml={1} mt={1}>
          <ErrorOutlineIcon color="error" fontSize="small" />
          <Box ml={1} color="error">
            Error
          </Box>
        </Box>
      )}
    </Box>
  );
};
