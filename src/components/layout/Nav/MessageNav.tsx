import React from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface MessageNavProps {
  altIndex: number;
  totalMessages: number;
  onGoPrev?: (event: React.MouseEvent) => void;
  onGoNext?: (event: React.MouseEvent) => void;
}

export const MessageNav = ({
  altIndex,
  totalMessages,
  onGoPrev,
  onGoNext,
}: MessageNavProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 0,
        height: 0,
        overflow: 'hidden',
        transition: 'width 0.3s ease, height 0.3s ease',
        '.hover-container:hover &': {
          width: 'auto',
          height: 32,
          overflow: 'visible',
        },
        position: 'relative',
        mt: 1,
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onGoPrev?.(e);
        }}
        sx={{
          color: '#fff',
          backgroundColor: '#333',
          '&:hover': { backgroundColor: '#444' },
          mr: 1,
        }}
        aria-label="Previous message"
      >
        <ChevronLeftIcon />
      </IconButton>

      <Typography
        variant="caption"
        color="inherit"
        sx={{
          userSelect: 'none',
          fontWeight: 'bold',
          fontSize: '0.75rem',
          fontFamily: 'monospace',
          color: 'rgba(255,255,255,0.7)',
          minWidth: 30,
          textAlign: 'center',
        }}
      >
        {altIndex + 1}/{totalMessages}
      </Typography>

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onGoNext?.(e);
        }}
        sx={{
          color: '#fff',
          backgroundColor: '#333',
          '&:hover': { backgroundColor: '#444' },
          ml: 1,
        }}
        aria-label="Next message"
      >
        <ChevronRightIcon />
      </IconButton>
    </Box>
  );
};
