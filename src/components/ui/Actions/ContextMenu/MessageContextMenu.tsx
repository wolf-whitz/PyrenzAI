import { Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import ImageIcon from '@mui/icons-material/Image'; 

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
  onEditClick: (
    messageId: string,
    currentMessage: string,
    type: 'user' | 'char'
  ) => void;
  handleCopy: () => void;
  onGenerateImage: (messageId: string) => void; 
  onClose: () => void;
}

const menuConfig = {
  user: [
    {
      icon: <DeleteIcon />,
      label: 'Delete',
      action: (props: MessageContextMenuProps) => () =>
        props.msg.id && props.onRemove(props.msg.id),
    },
    {
      icon: <FileCopyIcon />,
      label: 'Copy',
      action: (props: MessageContextMenuProps) => () => props.handleCopy(),
    },
    {
      icon: <EditIcon />,
      label: 'Edit',
      action: (props: MessageContextMenuProps) => () =>
        props.msg.id &&
        props.onEditClick(props.msg.id, props.msg.text || '', 'user'),
    },
  ],
  char: [
    {
      icon: <RefreshIcon />,
      label: 'Regenerate',
      action: (props: MessageContextMenuProps) => () =>
        props.msg.id && props.onRegenerate(props.msg.id),
    },
    {
      icon: <DeleteIcon />,
      label: 'Delete',
      action: (props: MessageContextMenuProps) => () =>
        props.msg.id && props.onRemove(props.msg.id),
    },
    {
      icon: <VolumeUpIcon />,
      label: 'Speak',
      action: (props: MessageContextMenuProps) => () =>
        props.handleSpeak(props.msg.text || ''),
    },
    {
      icon: <FileCopyIcon />,
      label: 'Copy',
      action: (props: MessageContextMenuProps) => () => props.handleCopy(),
    },
    {
      icon: <EditIcon />,
      label: 'Edit',
      action: (props: MessageContextMenuProps) => () =>
        props.msg.id &&
        props.onEditClick(props.msg.id, props.msg.text || '', 'char'),
    },
    {
      icon: <ImageIcon />,
      label: 'Generate Image',
      action: (props: MessageContextMenuProps) => () =>
        props.msg.id && props.onGenerateImage(props.msg.id),
    },
  ],
};

export const MessageContextMenu = (props: MessageContextMenuProps) => {
  const { msg, onClose } = props;
  if (msg.error) return null;

  const handleAction = (
    action: (props: MessageContextMenuProps) => () => void
  ) => {
    action(props)();
    onClose();
  };

  const menuItems = menuConfig[msg.type || 'user'] || [];

  return (
    <Box
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(40, 40, 40, 0.35)',
        backgroundImage:
          'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.05))',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        minWidth: '160px',
      }}
    >
      {menuItems.map((item, index) => (
        <Button
          key={index}
          onClick={() => handleAction(item.action)}
          startIcon={item.icon}
          sx={{
            justifyContent: 'flex-start',
            color: '#f0f0f0',
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: 2,
            px: 2,
            py: 1,
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
            },
          }}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );
};
