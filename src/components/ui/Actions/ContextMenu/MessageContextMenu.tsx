import React from 'react';
import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import RefreshIcon from '@mui/icons-material/Refresh';

interface MessageContextMenuProps {
  msg: {
    id?: string;
    text?: string;
    type?: 'user' | 'char';
    error?: boolean;
  };
  onRegenerate: (messageId: string) => void;
  onRemove: (messageId: string) => void;
  handleSpeak: (text: string) => void;
  onEditClick: (messageId: string, currentMessage: string, type: 'user' | 'char') => void;
  handleCopy: () => void;
  onClose: () => void;
}

const menuConfig = {
  user: [
    {
      icon: <DeleteIcon />,
      label: 'Delete',
      action: (props: MessageContextMenuProps) => () => props.msg.id && props.onRemove(props.msg.id),
    },
    {
      icon: <FileCopyIcon />,
      label: 'Copy',
      action: (props: MessageContextMenuProps) => () => props.handleCopy(),
    },
    {
      icon: <EditIcon />,
      label: 'Edit',
      action: (props: MessageContextMenuProps) => () => props.msg.id && props.onEditClick(props.msg.id, props.msg.text || '', 'user'),
    },
  ],
  char: [
    {
      icon: <RefreshIcon />,
      label: 'Regenerate',
      action: (props: MessageContextMenuProps) => () => props.msg.id && props.onRegenerate(props.msg.id),
    },
    {
      icon: <DeleteIcon />,
      label: 'Delete',
      action: (props: MessageContextMenuProps) => () => props.msg.id && props.onRemove(props.msg.id),
    },
    {
      icon: <VolumeUpIcon />,
      label: 'Speak',
      action: (props: MessageContextMenuProps) => () => props.handleSpeak(props.msg.text || ''),
    },
    {
      icon: <FileCopyIcon />,
      label: 'Copy',
      action: (props: MessageContextMenuProps) => () => props.handleCopy(),
    },
    {
      icon: <EditIcon />,
      label: 'Edit',
      action: (props: MessageContextMenuProps) => () => props.msg.id && props.onEditClick(props.msg.id, props.msg.text || '', 'char'),
    },
  ],
};

export const MessageContextMenu = (props: MessageContextMenuProps) => {
  const { msg, onClose } = props;

  if (msg.error) {
    return null;
  }

  const handleAction = (action: (props: MessageContextMenuProps) => () => void) => {
    action(props)();
    onClose();
  };

  const menuItems = menuConfig[msg.type || 'user'] || [];

  return (
    <Box p={1} display="flex" flexDirection="column">
      {menuItems.map((item, index) => (
        <Button
          key={index}
          onClick={() => handleAction(item.action)}
          startIcon={item.icon}
          sx={{
            justifyContent: 'flex-start',
            color: 'inherit',
            '&:hover': {
              backgroundColor: 'black',
              color: 'white',
              borderRadius: 2,
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );
};
