import React, { useState } from 'react';
import { Box, IconButton, Popover, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import RefreshIcon from '@mui/icons-material/Refresh';

interface MessageContextMenuProps {
  isUser: boolean;
  isAssistant: boolean;
  isFirstMessage: boolean;
  isGenerating: boolean;
  msg: {
    id?: string;
    text?: string;
    error?: boolean;
  };
  onRegenerate: (messageId: string) => void;
  onRemove: (messageId: string) => void;
  handleSpeak: (text: string) => void;
  onEditClick: (messageId: string, currentMessage: string, type: 'user' | 'char') => void;
  handleCopy: () => void;
}

export const MessageContextMenu = ({
  isUser,
  isAssistant,
  isFirstMessage,
  isGenerating,
  msg,
  onRegenerate,
  onRemove,
  handleSpeak,
  onEditClick,
  handleCopy,
}: MessageContextMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'message-popover' : undefined;

  if (isGenerating || msg.error || isFirstMessage) {
    return null;
  }

  return (
    <Box>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        size="small"
      >
        <MoreHorizIcon />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isUser ? 'right' : 'left',
        }}
      >
        <Box p={1} display="flex" flexDirection="column">
          {isUser && (
            <>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'black',
                    borderRadius: 2,
                    '& .MuiTypography-root, & .MuiIconButton-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <IconButton
                  onClick={() => {
                    msg.id && onRemove(msg.id);
                    handleClose();
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
                <Typography>Delete</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'black',
                    borderRadius: 2,
                    '& .MuiTypography-root, & .MuiIconButton-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <IconButton
                  onClick={() => {
                    handleCopy();
                    handleClose();
                  }}
                  size="small"
                >
                  <FileCopyIcon />
                </IconButton>
                <Typography>Copy</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'black',
                    borderRadius: 2,
                    '& .MuiTypography-root, & .MuiIconButton-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <IconButton
                  onClick={() => {
                    msg.id && onEditClick(msg.id, msg.text || '', 'user');
                    handleClose();
                  }}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <Typography>Edit</Typography>
              </Box>
            </>
          )}
          {isAssistant && (
            <>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'black',
                    borderRadius: 2,
                    '& .MuiTypography-root, & .MuiIconButton-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <IconButton
                  onClick={() => {
                    msg.id && onRegenerate(msg.id);
                    handleClose();
                  }}
                  size="small"
                >
                  <RefreshIcon />
                </IconButton>
                <Typography>Regenerate</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'black',
                    borderRadius: 2,
                    '& .MuiTypography-root, & .MuiIconButton-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <IconButton
                  onClick={() => {
                    msg.id && onRemove(msg.id);
                    handleClose();
                  }}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
                <Typography>Delete</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'black',
                    borderRadius: 2,
                    '& .MuiTypography-root, & .MuiIconButton-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <IconButton
                  onClick={() => {
                    handleSpeak(msg.text || '');
                    handleClose();
                  }}
                  size="small"
                >
                  <VolumeUpIcon />
                </IconButton>
                <Typography>Speak</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'black',
                    borderRadius: 2,
                    '& .MuiTypography-root, & .MuiIconButton-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <IconButton
                  onClick={() => {
                    handleCopy();
                    handleClose();
                  }}
                  size="small"
                >
                  <FileCopyIcon />
                </IconButton>
                <Typography>Copy</Typography>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'black',
                    borderRadius: 2,
                    '& .MuiTypography-root, & .MuiIconButton-root': {
                      color: 'white',
                    },
                  },
                }}
              >
                <IconButton
                  onClick={() => {
                    msg.id && onEditClick(msg.id, msg.text || '', 'char');
                    handleClose();
                  }}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <Typography>Edit</Typography>
              </Box>
            </>
          )}
        </Box>
      </Popover>
    </Box>
  );
};
