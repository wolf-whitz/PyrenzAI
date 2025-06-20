import React from 'react';
import { Box, Avatar, TextField, styled } from '@mui/material';
import { SxProps } from '@mui/system';
import { PyrenzBlueButton } from '~/theme';

interface PyrenzMessageBoxProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  sx?: SxProps;
  className?: string;
  isUser?: boolean;
  displayName?: string;
  userAvatar?: string;
  charAvatar?: string;
  isEditing?: boolean;
  localEditedMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  isLoading?: boolean;
}

const StyledPyrenzMessageBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '60%',
  padding: '10px 15px',
  borderRadius: '18px',
  margin: '10px',
  backgroundColor: '#374151',
  color: '#fff',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  wordWrap: 'break-word',
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    transform: 'translateY(-2px)',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
});

export const PyrenzMessageBox = ({
  children,
  onClick,
  sx,
  className,
  isUser,
  displayName,
  userAvatar,
  charAvatar,
  isEditing,
  localEditedMessage,
  onChange,
  onSaveEdit,
  onCancelEdit,
  isLoading,
}: PyrenzMessageBoxProps) => {
  const handleClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="flex-start"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      sx={{ width: '100%' }}
    >
      {!isUser && charAvatar && (
        <Avatar
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
                sx={{ backgroundColor: 'transparent' }}
              >
                {isLoading ? 'Saving...' : 'Submit'}
              </PyrenzBlueButton>
              <PyrenzBlueButton
                onClick={onCancelEdit}
                disabled={isLoading}
                sx={{ backgroundColor: 'transparent' }}
              >
                Cancel
              </PyrenzBlueButton>
            </Box>
          </Box>
        ) : (
          <Box>
            {children}
          </Box>
        )}
      </StyledPyrenzMessageBox>
      {isUser && userAvatar && (
        <Avatar
          alt={displayName}
          src={userAvatar}
          sx={{ width: 32, height: 32, ml: 1 }}
          className="rounded-full"
        />
      )}
    </Box>
  );
};
