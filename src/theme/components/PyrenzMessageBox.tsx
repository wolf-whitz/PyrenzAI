import React from 'react';
import { Box, Avatar, TextField, styled } from '@mui/material';
import { SxProps } from '@mui/system';
import { PyrenzBlueButton } from '~/theme';

interface PyrenzMessageBoxProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  sx?: SxProps;
  className?: string;
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
  backgroundColor:
    dataState === 'user'
      ? 'rgba(255, 255, 255, 0.2)'  
      : 'rgba(20, 24, 28, 0.6)',  
  backgroundImage:
    dataState === 'char'
      ? 'linear-gradient(135deg, rgba(173, 216, 230, 0.1), rgba(0, 0, 0, 0.2))'
      : 'none',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: '#fff',
  boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
  wordWrap: 'break-word',
  position: 'relative',
  cursor: 'pointer',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
  '&:hover': {
    backgroundColor:
      dataState === 'user'
        ? 'rgba(255, 255, 255, 0.15)'
        : 'rgba(20, 24, 28, 0.5)',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
  },
}));


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
      justifyContent={dataState === 'user' ? 'flex-end' : 'flex-start'}
      sx={{ width: '100%' }}
    >
      {dataState !== 'user' && charAvatar && (
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
      {dataState === 'user' && userAvatar && (
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
