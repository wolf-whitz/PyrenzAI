import React from 'react';
import { TypingIndicator, CustomMarkdown } from '@components';
import { Box, Avatar, IconButton, TextField } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import EditIcon from '@mui/icons-material/Edit';
import { PyrenzMessageBox, PyrenzBlueButton } from '~/theme';

interface MessageBoxProps {
  msg: any;
  index: number;
  isUser: boolean;
  displayName: string;
  icon: string;
  isGenerating: boolean;
  isLastMessage: boolean;
  user: any;
  char: any;
  onRegenerate: (messageId: string) => void;
  onRemove: (messageId: string) => void;
  onEditMessage: (messageId: string, editedMessage: string, type: 'user' | 'char') => void;
  handleSpeak: (text: string) => void;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
  editingMessageId: string | null;
  editedMessage: string;
  isLoading: boolean;
  onEditClick: (messageId: string, currentMessage: string) => void;
  onSaveEdit: (messageId: string, type: 'user' | 'char') => void;
  onCancelEdit: () => void;
  setEditedMessage: (message: string) => void;
}

export const MessageBox: React.FC<MessageBoxProps> = ({
  msg,
  index,
  isUser,
  displayName,
  icon,
  isGenerating,
  isLastMessage,
  user,
  char,
  onRegenerate,
  onRemove,
  handleSpeak,
  editingMessageId,
  editedMessage,
  isLoading,
  onEditClick,
  onSaveEdit,
  onCancelEdit,
  setEditedMessage,
}) => {
  const isFirstMessage = index === 0; 

  return (
    <Box
      key={msg.id ? `${msg.id}-${index}` : `temp-${index}`}
      display="flex"
      alignItems="start"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <Avatar
          alt={displayName}
          src={icon}
          sx={{ width: 32, height: 32 }}
          className="rounded-full"
        />
      )}

      {isUser && !isFirstMessage && (
        <Box display="flex" flexDirection="column" mr={isUser ? 1 : 0} ml={!isUser ? 1 : 0}>
          <IconButton
            onClick={() => onRemove && msg.id && onRemove(msg.id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => msg.id && onEditClick(msg.id, msg.text || '')}
            size="small"
          >
            <EditIcon />
          </IconButton>
        </Box>
      )}

      <PyrenzMessageBox
        sx={{ marginLeft: !isUser ? 2 : 0, marginRight: isUser ? 2 : 0 }}
        className={isUser ? 'user' : 'other'}
      >
        {isGenerating && !isUser && isLastMessage && !msg.text && <TypingIndicator />}
        {editingMessageId === msg.id ? (
          <Box display="flex" flexDirection="column">
            <TextField
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              autoFocus
            />
            <Box display="flex" justifyContent="space-between" mt={1}>
              <PyrenzBlueButton
                onClick={() => msg.id && onSaveEdit(msg.id, isUser ? 'user' : 'char')}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Submit'}
              </PyrenzBlueButton>
              <PyrenzBlueButton
                onClick={onCancelEdit}
                disabled={isLoading}
              >
                Cancel
              </PyrenzBlueButton>
            </Box>
          </Box>
        ) : (
          <CustomMarkdown text={msg.text} user={user} char={char} />
        )}
      </PyrenzMessageBox>

      {!isUser && !isGenerating && !isFirstMessage && ( 
        <Box display="flex" flexDirection="column" ml={1}>
          <IconButton
            onClick={() => msg.id && onRegenerate(msg.id)}
            size="small"
          >
            <RefreshIcon />
          </IconButton>
          <IconButton
            onClick={() => onRemove && msg.id && onRemove(msg.id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            onClick={() => handleSpeak(msg.text || '')}
            size="small"
          >
            <VolumeUpIcon />
          </IconButton>
          <IconButton
            onClick={() => msg.id && onEditClick(msg.id, msg.text || '')}
            size="small"
          >
            <EditIcon />
          </IconButton>
        </Box>
      )}

      {isUser && (
        <Avatar
          alt={displayName}
          src={icon}
          sx={{ width: 32, height: 32 }}
          className="rounded-full"
        />
      )}

      {msg.error && (
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
