import React from 'react';
import TypingIndicator from '../Indicator/TypingIndicator';
import CustomMarkdown from '../Markdown/CustomMarkdown';
import { Box, Avatar, IconButton } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';

interface Message {
  id?: string;
  character_name: string;
  username?: string;
  text: string;
  icon: string;
  type: 'user' | 'assistant';
  token?: number | null;
  role?: string | null;
  error?: boolean;
}

interface ChatMessagesProps {
  previous_message: Message[];
  isGenerating?: boolean;
  messageId?: string | null;
  token?: number | null;
  role?: string | null;
  user: { username: string };
  char: { character_name: string };
  onRegenerate?: (messageId: string) => void;
  onRemove?: (messageId: string) => void;
}

export default function ChatMessages({
  previous_message,
  isGenerating,
  user,
  char,
  onRegenerate,
  onRemove,
}: ChatMessagesProps) {
  return (
    <Box className="space-y-4 p-4 max-w-2xl mx-auto">
      {previous_message.map((msg, index) => {
        const isUser = msg.type === 'user';
        const displayName = isUser ? msg.username || user.username : msg.character_name || char.character_name;
        const icon = msg.icon || '';
        const isLatestMessage = index === previous_message.length - 1;

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

            <Box
              className={`flex flex-col max-w-md p-3 rounded-lg shadow-md ${
                isUser ? 'bg-gray-500 text-white' : 'bg-gray-700 text-white'
              }`}
              sx={{ marginLeft: !isUser ? 2 : 0, marginRight: isUser ? 2 : 0 }}
            >
              {isGenerating &&
                !isUser &&
                index === previous_message.length - 1 && <TypingIndicator />}
              <CustomMarkdown
                text={msg.text}
                user={user}
                char={char}
              />
            </Box>

            {msg.error && (
              <Box display="flex" alignItems="center" ml={1} mt={1}>
                <ErrorOutlineIcon color="error" fontSize="small" />
                <Box ml={1} color="error">
                  Error
                </Box>
              </Box>
            )}

            {!isUser && isLatestMessage && (
              <Box display="flex" flexDirection="column" ml={1}>
                <IconButton
                  onClick={() => onRegenerate && msg.id && onRegenerate(msg.id)}
                  aria-label="regenerate"
                >
                  <ReplayIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={() => onRemove && msg.id && onRemove(msg.id)}
                  aria-label="remove"
                >
                  <DeleteIcon fontSize="small" />
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
          </Box>
        );
      })}
    </Box>
  );
}
