import React, { useState, useEffect } from 'react';
import { Box, Avatar, TextField, styled, SxProps } from '@mui/material';
import { PyrenzBlueButton } from '~/theme';
import { CustomMarkdown, TypingIndicator, MessageNav } from '@components';

export interface PyrenzMessageBoxProps {
  role: 'user' | 'char';
  content?: string;
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
  onClick?: (event: React.MouseEvent) => void;
  sx?: SxProps;
  className?: string;
  alternativeMessages?: string[];
  char?: { name?: string };
  ai_message?: string;
  isGeneratingEmptyCharMessage?: boolean;
  alternation_first?: boolean;
  disableReplacement?: boolean;
}

const StyledPyrenzMessageBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'role',
})<{ role: 'user' | 'char' }>(({ role }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '10px 15px',
  borderRadius: '18px',
  margin: '10px',
  backgroundColor: role === 'user' ? '#555' : 'rgba(20,24,28,0.6)',
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
    backgroundColor: role === 'user' ? '#444' : 'rgba(20,24,28,0.5)',
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

export function PyrenzMessageBox({
  content = '',
  onClick,
  sx,
  className,
  role,
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
  alternativeMessages = [],
  char = {},
  ai_message = '',
  isGeneratingEmptyCharMessage = false,
  alternation_first = true,
  disableReplacement = false,
}: PyrenzMessageBoxProps) {
  const [altIndex, setAltIndex] = useState(
    alternation_first ? 0 : alternativeMessages.length - 1
  );

  useEffect(() => {
    setAltIndex(alternation_first ? 0 : alternativeMessages.length - 1);
  }, [alternativeMessages, alternation_first]);

  const totalMessages = alternativeMessages.length;

  function getDisplayedText() {
    if (totalMessages > 0) {
      return alternativeMessages[altIndex] ?? '';
    }
    return content;
  }

  function handleGoPrev(event: React.MouseEvent) {
    event.stopPropagation();
    setAltIndex((prev) => (prev === 0 ? totalMessages - 1 : prev - 1));
    onGoPrev?.(event);
  }

  function handleGoNext(event: React.MouseEvent) {
    event.stopPropagation();
    setAltIndex((prev) => (prev + 1) % totalMessages);
    onGoNext?.(event);
  }

  function handleClick(event: React.MouseEvent) {
    onClick?.(event);
  }

  function renderContent() {
    if (isEditing) {
      return (
        <Box display="flex" flexDirection="column" flex={1}>
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
          dataState={role}
          char={char}
          ai_message={ai_message}
          disableReplacement={disableReplacement}
        />
        {showNav && totalMessages > 1 && (
          <MessageNav
            altIndex={altIndex}
            totalMessages={totalMessages}
            onGoPrev={handleGoPrev}
            onGoNext={handleGoNext}
          />
        )}
      </>
    );
  }

  return (
    <Box
      className="hover-container"
      display="flex"
      flexDirection="column"
      alignItems={role === 'user' ? 'flex-end' : 'flex-start'}
      sx={{ width: '100%' }}
    >
      <Box display="flex" alignItems="flex-start" flex={1}>
        {role !== 'user' && charAvatar && (
          <HoverableAvatar
            alt={displayName ?? ''}
            src={charAvatar}
            sx={{ width: 32, height: 32, mr: 1 }}
            className="rounded-full"
          />
        )}
        <StyledPyrenzMessageBox
          onClick={handleClick}
          sx={{ ...sx, flex: 1 }}
          className={className}
          role={role}
        >
          {renderContent()}
        </StyledPyrenzMessageBox>
        {role === 'user' && userAvatar && (
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
}
