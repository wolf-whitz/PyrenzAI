import React from 'react';
import TypingIndicator from '../Indicator/TypingIndicator';
import CustomMarkdown from '../Markdown/CustomMarkdown';
import { Box, Avatar } from '@mui/material';
import { AlertCircle } from 'lucide-react';

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
}

export default function ChatMessages({
  previous_message,
  isGenerating,
}: ChatMessagesProps) {
  return (
    <Box className="space-y-4 p-4 max-w-2xl mx-auto">
      {previous_message.map((msg, index) => {
        const isUser = msg.type === 'user';
        const displayName = isUser ? msg.username || 'User' : msg.character_name || 'Anon';
        const icon = msg.icon || '';

        console.log('Username:', msg.username);
        console.log('Character Name:', msg.character_name);

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
                user={msg.username || 'User'}
                char={msg.character_name || 'Anon'}
              />
            </Box>

            {msg.error && (
              <Box display="flex" alignItems="center" ml={1} mt={1}>
                <AlertCircle color="red" size={16} />
                <Box ml={1} color="red">
                  Error
                </Box>
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
