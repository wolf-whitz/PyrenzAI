import React, { useState } from 'react';
import { TypingIndicator, CustomContextMenu, CustomMarkdown } from '@components';
import { Box, Avatar } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { ChatMessagesProps } from '@shared-types/ChatmainTypes';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { speakMessage } from '@api';

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
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    messageId: string;
  } | null>(null);

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleMessageClick = (event: React.MouseEvent, messageId: string) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      messageId,
    });
  };

  const handleSpeak = async (text: string) => {
    setIsGenerating(true);
    try {
      await speakMessage(text, char.gender as string, () => {
        setIsGenerating(false);
      });
    } catch (error) {
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

        const menuItems = [
          {
            label: 'Regenerate',
            action: () => {
              handleClose();
              onRegenerate && msg.id && onRegenerate(msg.id);
            },
            icon: <RefreshIcon />,
          },
          {
            label: 'Delete',
            action: () => {
              handleClose();
              onRemove && msg.id && onRemove(msg.id);
            },
            icon: <DeleteIcon />,
          },
          {
            label: 'Speak',
            action: () => {
              handleClose();
              handleSpeak(msg.text);
            },
            icon: <VolumeUpIcon />,
          },
        ];

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
              onClick={(event) => handleMessageClick(event, msg.id || '')}
            >
              {isGenerating &&
                !isUser &&
                index === previous_message.length - 1 && <TypingIndicator />}
              <CustomMarkdown text={msg.text} user={user} char={char} />
            </Box>

            {msg.error && (
              <Box display="flex" alignItems="center" ml={1} mt={1}>
                <ErrorOutlineIcon color="error" fontSize="small" />
                <Box ml={1} color="error">
                  Error
                </Box>
              </Box>
            )}

            {contextMenu && contextMenu.messageId === msg.id && (
              <CustomContextMenu
                items={menuItems}
                onClose={handleClose}
                anchorPosition={{
                  top: contextMenu.mouseY,
                  left: contextMenu.mouseX,
                }}
              />
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
