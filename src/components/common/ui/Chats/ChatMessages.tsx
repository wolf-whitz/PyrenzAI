import TypingIndicator from '../Indicator/TypingIndicator';
import CustomMarkdown from '../Markdown/CustomMarkdown';
import { Box, Avatar } from '@mui/material';

interface Message {
  name: string;
  user_name?: string;
  char_name?: string;
  text: string;
  icon: string;
  type: 'user' | 'assistant';
  token?: number | null;
  role?: string | null;
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
  messageId,
  token,
  role,
}: ChatMessagesProps) {
  return (
    <Box className="space-y-4 p-4 max-w-2xl mx-auto">
      {previous_message.map((msg, index) => {
        const isUser = msg.type === 'user';
        const displayName = isUser ? msg.user_name : msg.name || 'Anon';
        const icon =
          msg.icon ||
          `https://api.dicebear.com/9.x/adventurer/svg?seed=${msg.name?.split('@')[0] || 'Anon'}`;

        return (
          <Box
            key={index}
            display="flex"
            alignItems="start"
            justifyContent={isUser ? 'flex-end' : 'flex-start'}
            data-message-id={messageId ?? undefined}
            data-message-token={msg.token ?? token ?? undefined}
            data-role-message={msg.role ?? role ?? undefined}
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
              className={`flex flex-col max-w-md p-3 rounded-lg shadow-md ${isUser ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'}`}
              sx={{ marginLeft: !isUser ? 2 : 0, marginRight: isUser ? 2 : 0 }}
            >
              {isGenerating &&
                !isUser &&
                index === previous_message.length - 1 && <TypingIndicator />}
              <CustomMarkdown
                text={msg.text}
                user={msg.user_name || 'User'}
                char={msg.char_name || 'Anon'}
              />
            </Box>

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
