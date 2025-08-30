import React, { useState, useEffect } from 'react';
import { Box, Avatar, TextField, styled, SxProps } from '@mui/material';
import { PyrenzBlueButton } from '~/theme';
import { CustomMarkdown, TypingIndicator, MessageNav } from '@components';
import { useChatStore } from '~/store';
import type { Message } from '@shared-types';

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
  msg?: Message;
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
  currentMessageIndex = 0,
  alternativeMessages = [],
  char = {},
  ai_message = '',
  isGeneratingEmptyCharMessage = false,
  alternation_first = true,
  disableReplacement = false,
  msg,
}: PyrenzMessageBoxProps) {
  const totalMessages = alternativeMessages.length;

  const getDisplayedText = () => {
    if (isEditing) return localEditedMessage ?? '';

    if (totalMessages > 0) {
      if (currentMessageIndex === 0) {
        return content;
      } else if (
        currentMessageIndex >= 1 &&
        currentMessageIndex <= totalMessages
      ) {
        return alternativeMessages[currentMessageIndex - 1] ?? '';
      }
    }
    return content;
  };

  const handleGoPrev = (event: React.MouseEvent) => {
    event.stopPropagation();
    onGoPrev?.(event);
  };

  const handleGoNext = (event: React.MouseEvent) => {
    event.stopPropagation();
    onGoNext?.(event);
  };

  const handleClick = (event: React.MouseEvent) => onClick?.(event);

  return (
    <Box
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
          />
        )}
        <StyledPyrenzMessageBox
          onClick={handleClick}
          sx={{ ...sx, flex: 1 }}
          className={`${className} hover-container`}
          role={role}
        >
          {isEditing ? (
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
          ) : isGeneratingEmptyCharMessage ? (
            <TypingIndicator />
          ) : (
            <>
              <CustomMarkdown
                text={getDisplayedText()}
                dataState={role}
                char={char}
                ai_message={ai_message}
                disableReplacement={disableReplacement}
              />
              {showNav && totalMessages > 0 && (
                <MessageNav
                  altIndex={currentMessageIndex}
                  totalMessages={totalMessages + 1}
                  onGoPrev={handleGoPrev}
                  onGoNext={handleGoNext}
                />
              )}
            </>
          )}
        </StyledPyrenzMessageBox>
        {role === 'user' && userAvatar && (
          <HoverableAvatar
            alt={displayName ?? ''}
            src={userAvatar}
            sx={{ width: 32, height: 32, ml: 1 }}
          />
        )}
      </Box>
    </Box>
  );
}
