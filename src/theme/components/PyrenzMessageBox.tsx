import React from 'react';
import { Box, styled } from '@mui/material';
import { SxProps } from '@mui/system';
import { useUserStore } from '~/store';

interface PyrenzMessageBoxProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent) => void;
  sx?: SxProps;
  className?: string;
}

const StyledPyrenzMessageBox = styled(Box)(({ theme }) => {
  const { customization } = useUserStore.getState();

  const { transparency = true } = customization || {};

  return {
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
      backgroundColor: transparency ? 'rgba(55, 65, 81, 0.6)' : 'rgba(55, 65, 81, 0.8)',
      transform: 'translateY(-2px)',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    },
  };
});

export const PyrenzMessageBox = ({
  children,
  onClick,
  sx,
  className,
}: PyrenzMessageBoxProps) => {
  const handleClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <StyledPyrenzMessageBox onClick={handleClick} sx={sx} className={className}>
      {children}
    </StyledPyrenzMessageBox>
  );
};
