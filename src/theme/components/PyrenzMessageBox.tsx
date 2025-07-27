import React from 'react';
import {
  Box,
  Avatar,
  TextField,
  styled,
  IconButton,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SxProps } from '@mui/system';
import { PyrenzBlueButton } from '~/theme';

interface PyrenzMessageBoxProps {
  dataState: 'user' | 'char';
  displayName?: string;
  userAvatar?: string;
  charAvatar?: string;
  isEditing?: boolean;
  localEditedMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  isLoading?: boolean;
  onGoPrev?: (event: React.MouseEvent) => void;
  onGoNext?: (event: React.MouseEvent) => void;
  showNav?: boolean;
  currentMessageIndex?: number;
  totalMessages?: number;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  sx?: SxProps;
  className?: string;
  alternativeMessages?: string[];
}

const StyledPyrenzMessageBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'dataState',
})<{ dataState: 'user' | 'char' }>(({ dataState }) => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '60%',
  padding: '10px 15px',
  borderRadius: '18px',
  margin: '10px',
  backgroundColor: dataState === 'user' ? '#555555' : 'rgba(20, 24, 28, 0.6)',
  backgroundImage:
    dataState === 'char'
      ? 'linear-gradient(135deg, rgba(173, 216, 230, 0.1), rgba(0, 0, 0, 0.2))'
      : 'none',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: dataState === 'user' ? '#f1f1f1' : '#fff',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  wordWrap: 'break-word',
  overflowWrap: 'anywhere',
  position: 'relative',
  cursor: 'pointer',
  transition:
    'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    backgroundColor: dataState === 'user' ? '#444444' : 'rgba(20, 24, 28, 0.5)',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const HoverableAvatar = styled(Avatar)({
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'scale(1.2)',
  },
});

export const PyrenzMessageBox = ({
  children,
  onClick,
  sx,
  className,
  dataState,
  displayName,
  userAvatar,
  charAvatar,
  isEditing,
  localEditedMessage,
  onChange,
  onSaveEdit,
  onCancelEdit,
  isLoading,
  onGoPrev,
  onGoNext,
  showNav,
  currentMessageIndex = 0,
  alternativeMessages = [],
}: PyrenzMessageBoxProps) => {
  const handleClick = (event: React.MouseEvent) => {
    if (onClick) onClick(event);
  };

  const handleGoPrev = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onGoPrev) onGoPrev(event);
  };

  const handleGoNext = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onGoNext) onGoNext(event);
  };

  const currentText =
    alternativeMessages.length > 0
      ? alternativeMessages[currentMessageIndex] ?? ''
      : (children as string);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={dataState === 'user' ? 'flex-end' : 'flex-start'}
      sx={{ width: '100%' }}
    >
      <Box display="flex" alignItems="flex-start">
        {dataState !== 'user' && charAvatar && (
          <HoverableAvatar
            alt={displayName}
            src={charAvatar}
            sx={{ width: 32, height: 32, mr: 1 }}
            className="rounded-full"
          />
        )}
        <StyledPyrenzMessageBox
          onClick={handleClick}
          sx={sx}
          className={className}
          dataState={dataState}
        >
          {isEditing ? (
            <Box display="flex" flexDirection="column" width="100%">
              <TextField
                value={localEditedMessage}
                onChange={onChange}
                autoFocus
                multiline
                fullWidth
                minRows={3}
                maxRows={20}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    padding: '8px',
                    '& fieldset': {
                      border: 'none',
                    },
                  },
                  '& textarea': {
                    overflow: 'auto',
                  },
                }}
              />
              <Box display="flex" justifyContent="flex-end" gap={1} mt={1}>
                <PyrenzBlueButton
                  onClick={onSaveEdit}
                  disabled={isLoading}
                  sx={{ backgroundColor: 'transparent', color: '#fff' }}
                >
                  {isLoading ? 'Saving...' : 'Submit'}
                </PyrenzBlueButton>
                <PyrenzBlueButton
                  onClick={onCancelEdit}
                  disabled={isLoading}
                  sx={{ backgroundColor: 'transparent', color: '#fff' }}
                >
                  Cancel
                </PyrenzBlueButton>
              </Box>
            </Box>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
                lineHeight: 1.5,
              }}
            >
              {currentText}
            </Box>
          )}
          {showNav && alternativeMessages.length > 0 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={1}
              gap={1}
            >
              <IconButton
                size="small"
                onClick={handleGoPrev}
                sx={{
                  color: '#fff',
                  backgroundColor: '#333',
                  '&:hover': { backgroundColor: '#444' },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="caption" color="inherit">
                {currentMessageIndex + 1}/{alternativeMessages.length}
              </Typography>
              <IconButton
                size="small"
                onClick={handleGoNext}
                sx={{
                  color: '#fff',
                  backgroundColor: '#333',
                  '&:hover': { backgroundColor: '#444' },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          )}
        </StyledPyrenzMessageBox>
        {dataState === 'user' && userAvatar && (
          <HoverableAvatar
            alt={displayName}
            src={userAvatar}
            sx={{ width: 32, height: 32, ml: 1 }}
            className="rounded-full"
          />
        )}
      </Box>
    </Box>
  );
};
