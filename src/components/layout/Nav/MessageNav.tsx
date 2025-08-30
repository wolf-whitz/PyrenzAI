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
        width: 'auto',
        height: 32,
        opacity: 0.7,
        transition: 'opacity 0.3s ease',
        '.hover-container:hover &': {
          opacity: 1,
        },
        position: 'relative',
        mt: 1,
        mb: 0.5,
      }}
    >
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onGoPrev?.(e);
        }}
        disabled={altIndex === 0}
        sx={{
          color: '#fff',
          backgroundColor: altIndex === 0 ? 'rgba(51,51,51,0.5)' : '#333',
          '&:hover': { 
            backgroundColor: altIndex === 0 ? 'rgba(51,51,51,0.5)' : '#444' 
          },
          '&:disabled': {
            color: 'rgba(255,255,255,0.3)',
          },
          mr: 1,
          minWidth: 32,
          height: 32,
        }}
        aria-label="Previous alternative message"
      >
        <ChevronLeftIcon fontSize="small" />
      </IconButton>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: 1,
          px: 1.5,
          py: 0.5,
          mx: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            userSelect: 'none',
            fontWeight: 'bold',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.9)',
            minWidth: 40,
            textAlign: 'center',
          }}
        >
          {altIndex + 1} / {totalMessages}
        </Typography>
      </Box>

      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          onGoNext?.(e);
        }}
        disabled={altIndex === totalMessages - 1}
        sx={{
          color: '#fff',
          backgroundColor: altIndex === totalMessages - 1 ? 'rgba(51,51,51,0.5)' : '#333',
          '&:hover': { 
            backgroundColor: altIndex === totalMessages - 1 ? 'rgba(51,51,51,0.5)' : '#444' 
          },
          '&:disabled': {
            color: 'rgba(255,255,255,0.3)',
          },
          ml: 1,
          minWidth: 32,
          height: 32,
        }}
        aria-label="Next alternative message"
      >
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};
