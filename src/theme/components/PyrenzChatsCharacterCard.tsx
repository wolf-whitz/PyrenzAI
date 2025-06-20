import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  SxProps,
  Theme,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { PyrenzRibbon } from '~/theme';

const StyledCardImage = styled('div')({
  width: '120px',
  height: '220px',
  overflow: 'hidden',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const StyledCardName = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  marginBottom: '8px',
  color: '#f8f9fa',
});

const StyledCardContent = styled(CardContent)({
  flex: '1',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  '&:last-child': {
    paddingBottom: '16px',
  },
});

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

interface PyrenzChatsCharacterCardProps {
  imageSrc: string;
  characterName: string;
  children?: React.ReactNode;
  ChatSend?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDeleteClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onPinClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
  sx?: SxProps<Theme>;
  isPinned?: boolean;
}

export const PyrenzChatsCharacterCard: React.FC<PyrenzChatsCharacterCardProps> = ({
  imageSrc,
  characterName,
  children,
  ChatSend,
  onDeleteClick,
  onPinClick,
  style,
  sx,
  isPinned = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Card
      style={style}
      sx={{
        display: 'flex',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        backgroundColor: '#111827',
        color: '#f8f9fa',
        position: 'relative',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
        },
        ...sx,
      }}
    >
      <StyledCardImage>
        <StyledImage src={imageSrc} alt="Preview" />
        {isPinned && <PyrenzRibbon color="red">Pinned</PyrenzRibbon>}
      </StyledCardImage>
      <StyledCardContent>
        <StyledCardName>{characterName}</StyledCardName>
        <Typography variant="body2" color="text.secondary">
          {children}
        </Typography>
      </StyledCardContent>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'inherit',
        }}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: '20ch',
          },
        }}
      >
        <MenuItem onClick={(e) => {
          handleClose();
          if (ChatSend) {
            ChatSend(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}>
          Chat Now
        </MenuItem>
        <MenuItem onClick={(e) => {
          handleClose();
          if (onPinClick) {
            onPinClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
          }
        }}>
          Pin Chat
        </MenuItem>
        <MenuItem onClick={(e) => {
          handleClose();
          if (onDeleteClick) {
            onDeleteClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
          }
        }}>
          Delete Chat
        </MenuItem>
      </Menu>
    </Card>
  );
};
