import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  SxProps,
  Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import PushPinIcon from '@mui/icons-material/PushPin';
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

const ActionIconsContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '8px',
  right: '8px',
  display: 'flex',
  gap: '8px',
  [theme.breakpoints.down('sm')]: {
    display: 'none',  
  },
}));

interface PyrenzChatsCharacterCardProps {
  imageSrc: string;
  characterName: string;
  children?: React.ReactNode;
  onCardClick?: () => void;
  onContextMenu?: (event: React.MouseEvent) => void;
  onDeleteClick?: () => void;
  onPinClick?: () => void;
  style?: React.CSSProperties;
  sx?: SxProps<Theme>;
  isPinned?: boolean;
}

export const PyrenzChatsCharacterCard = ({
  imageSrc,
  characterName,
  children,
  onCardClick,
  onContextMenu,
  onDeleteClick,
  onPinClick,
  style,
  sx,
  isPinned = false,
}: PyrenzChatsCharacterCardProps) => {
  return (
    <Card
      onClick={onCardClick}
      onContextMenu={onContextMenu}
      style={style}
      sx={{
        display: 'flex',
        width: '400px',
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
        {isPinned && <PyrenzRibbon color="red">Pinned</PyrenzRibbon>}
      </StyledCardImage>
      <StyledCardContent>
        <StyledCardName>{characterName}</StyledCardName>
        {children}
      </StyledCardContent>
      <ActionIconsContainer>
        <IconButton
          aria-label="pin"
          title="Pin this chat"
          onClick={(e) => {
            e.stopPropagation();
            onPinClick && onPinClick();
          }}
        >
          <PushPinIcon style={{ color: '#f8f9fa' }} />
        </IconButton>
        <IconButton
          aria-label="delete"
          title="Delete this chat"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteClick && onDeleteClick();
          }}
        >
          <DeleteIcon style={{ color: '#f8f9fa' }} />
        </IconButton>
      </ActionIconsContainer>
    </Card>
  );
};
