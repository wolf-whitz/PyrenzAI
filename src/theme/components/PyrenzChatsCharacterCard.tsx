import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Popover,
  SxProps,
  Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';

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

const ActionIconsContainer = styled('div')({
  position: 'absolute',
  top: '8px',
  right: '8px',
  display: 'flex',
  gap: '8px',
});

interface PyrenzChatsCharacterCardProps {
  imageSrc: string;
  characterName: string;
  children?: React.ReactNode;
  onCardClick?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  onDeleteClick?: () => void;
  style?: React.CSSProperties;
  sx?: SxProps<Theme>;
}

export const PyrenzChatsCharacterCard = ({
  imageSrc,
  characterName,
  children,
  onCardClick,
  onContextMenu,
  onDeleteClick,
  style,
  sx,
}: PyrenzChatsCharacterCardProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Card
      onClick={onCardClick}
      onContextMenu={onContextMenu}
      style={style}
      sx={{
        display: 'flex',
        width: '100%',
        maxWidth: 400,
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        backgroundColor: '#111827',
        color: '#f8f9fa',
        cursor: 'pointer',
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
      </StyledCardImage>
      <StyledCardContent>
        <StyledCardName>{characterName}</StyledCardName>
        {children}
      </StyledCardContent>
      <ActionIconsContainer>
        <IconButton
          aria-label="delete"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick && onDeleteClick();
          }}
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <DeleteIcon style={{ color: '#f8f9fa' }} />
        </IconButton>
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: 'none',
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <Typography sx={{ p: 1 }}>Delete this item</Typography>
        </Popover>
      </ActionIconsContainer>
    </Card>
  );
};
