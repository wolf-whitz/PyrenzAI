import React from 'react';
import { TypingIndicator, CustomMarkdown } from '@components';
import { Box, Avatar, IconButton } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ChatMessagesProps } from '@shared-types/ChatmainTypes';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { speakMessage } from '@api';  
import { PyrenzMessageBox } from '~/theme';

export function ChatMessages({
  previous_message,
  isGenerating = false,
  user,
  char,
  onRegenerate,
  onRemove,
  setIsGenerating,
}: ChatMessagesProps & {
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const handleSpeak = async (text: string) => {
    setIsGenerating(true);
    try {
      await speakMessage(text, char.gender as string, () => {
        setIsGenerating(false);
      });
    } catch (error) {
      console.error("Error speaking message:", error);
      setIsGenerating(false);
    }
  };

  return (
    <Box className="space-y-4 p-4 max-w-2xl mx-auto">
      {previous_message.map((msg, index) => {
        const isUser = msg.type === 'user';
        const displayName = isUser
          ? msg.username || user.username
          : msg.character_name || char.character_name;
        const icon = msg.icon || '';
        const isLastMessage = index === previous_message.length - 1;

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

            {isUser && (
              <Box display="flex" flexDirection="column" mr={1}>
                <IconButton
                  onClick={() => onRemove && msg.id && onRemove(msg.id)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            )}

            <PyrenzMessageBox
              sx={{ marginLeft: !isUser ? 2 : 0, marginRight: isUser ? 2 : 0 }}
              className={isUser ? 'user' : 'other'}
            >
              {isGenerating && !isUser && isLastMessage && <TypingIndicator />}
              <CustomMarkdown text={msg.text} user={user} char={char} />
            </PyrenzMessageBox>

            {!isUser && !isGenerating && (
              <Box display="flex" flexDirection="column" ml={1}>
                <IconButton
                  onClick={() => onRegenerate && msg.id && onRegenerate(msg.id)}
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
                  onClick={() => handleSpeak(msg.text)}
                  size="small"
                >
                  <VolumeUpIcon />
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
      })}
    </Box>
  );
}
