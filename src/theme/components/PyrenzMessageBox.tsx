import React from 'react';
import { Box, styled } from '@mui/material';
import { SxProps } from '@mui/system';

interface PyrenzMessageBoxProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  sx?: SxProps;
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
  '&::after': {
    content: '""',
    position: 'absolute',
    borderWidth: '10px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    bottom: '-10px',
    left: '10px',
  },
  '&.user': {
    '&::after': {
      left: 'auto',
      right: '10px',
      borderLeftColor: '#374151',
    },
  },
  '&.other': {
    '&::after': {
      borderRightColor: '#374151',
    },
  },
});

export const PyrenzMessageBox = ({ children, onClick, sx }: PyrenzMessageBoxProps) => {
  return (
    <StyledPyrenzMessageBox onClick={onClick} sx={sx}>
      {children}
    </StyledPyrenzMessageBox>
  );
};
