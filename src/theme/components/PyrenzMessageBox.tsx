import React from 'react';
import {
  Box,
  Avatar,
  TextField,
  styled,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SxProps } from '@mui/system';
import { PyrenzBlueButton } from '~/theme';
import { CustomMarkdown, TypingIndicator } from '~/components';

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
  children?: string;
  onClick?: (event: React.MouseEvent) => void;
  sx?: SxProps;
  className?: string;
  alternativeMessages?: string[];
  char?: { name?: string };
  ai_message?: string;
  isGeneratingEmptyCharMessage?: boolean;
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
  backgroundColor: dataState === 'user' ? '#555' : 'rgba(20,24,28,0.6)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#fff',
  wordWrap: 'break-word',
  overflowWrap: 'anywhere',
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.25s ease',
  '&:hover': {
    backgroundColor: dataState === 'user' ? '#444' : 'rgba(20,24,28,0.5)',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
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
  children = '',
  onClick,
  sx,
  className,
  dataState,
  displayName,
  userAvatar,
  charAvatar,
  isEditing = false,
  localEditedMessage = '',
  onChange,
  onSaveEdit,
  onCancelEdit,
  isLoading = false,
  onGoPrev,
  onGoNext,
  showNav = false,
  currentMessageIndex = 0,
  alternativeMessages = [],
  char = {},
  ai_message = '',
  isGeneratingEmptyCharMessage = false,
}: PyrenzMessageBoxProps) => {
  const handleClick = (event: React.MouseEvent) => onClick?.(event);
  const handleGoPrev = (event: React.MouseEvent) => {
    event.stopPropagation();
    onGoPrev?.(event);
  };
  const handleGoNext = (event: React.MouseEvent) => {
    event.stopPropagation();
    onGoNext?.(event);
  };

  const getDisplayedText = () => {
    if (alternativeMessages.length > 0) {
      return alternativeMessages[currentMessageIndex] ?? '';
    }
    return children;
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <Box display="flex" flexDirection="column" width="100%">
          <TextField
            value={localEditedMessage ?? ''}
            onChange={onChange}
            autoFocus
            multiline
            fullWidth
            minRows={3}
            maxRows={20}
            sx={{
              '& .MuiOutlinedInput-root': {
                padding: '8px',
                '& fieldset': { border: 'none' },
              },
              '& textarea': { overflow: 'auto' },
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
      );
    }

    if (isGeneratingEmptyCharMessage) {
      return <TypingIndicator />;
    }

    return (
      <>
        <CustomMarkdown
          text={getDisplayedText()}
          dataState={dataState}
          char={char}
          ai_message={ai_message}
        />

        {showNav && alternativeMessages.length > 1 && (
          <Box display="flex" justifyContent="center" alignItems="center" mt={1} gap={1}>
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
      </>
    );
  };

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
            alt={displayName ?? ''}
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
          {renderContent()}
        </StyledPyrenzMessageBox>
        {dataState === 'user' && userAvatar && (
          <HoverableAvatar
            alt={displayName ?? ''}
            src={userAvatar}
            sx={{ width: 32, height: 32, ml: 1 }}
            className="rounded-full"
          />
        )}
      </Box>
    </Box>
  );
};
