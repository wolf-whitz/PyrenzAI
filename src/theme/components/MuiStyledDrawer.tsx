import React from 'react';
import { Drawer, Avatar, Typography, Divider, Box } from '@mui/material';

interface MuiStyledDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    name: string;
    avatarUrl: string;
  };
  children: React.ReactNode;
}

export const MuiStyledDrawer = ({ isOpen, onClose, profileData, children }: MuiStyledDrawerProps) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: '#111827',
          color: '#FFFFFF',
          width: 250,
          padding: 2,
        },
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar alt="Profile" src={profileData.avatarUrl} />
        <Typography
          variant="subtitle1"
          sx={{
            marginLeft: 1,
            fontFamily: 'font-baloo',
          }}
        >
          {profileData.name}
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: '#4B5563', marginBottom: 2 }} />
      {children}
    </Drawer>
  );
};
