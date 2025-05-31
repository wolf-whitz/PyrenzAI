import React from 'react';
import { Drawer, Avatar, Typography, Divider, Box } from '@mui/material';

interface PyrenzStyledDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    name: string;
    avatarUrl: string;
  };
  children: React.ReactNode;
}

export const PyrenzStyledDrawer = ({
  isOpen,
  onClose,
  profileData,
  children,
}: PyrenzStyledDrawerProps) => {
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          backgroundColor: 'rgba(17, 24, 39, 0.5)',
          backdropFilter: 'blur(15px)',
          color: '#FFFFFF',
          width: 200,
          padding: 1,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
        },
      }}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <Avatar alt="Profile" src={profileData.avatarUrl} sx={{ width: 32, height: 32 }} />
        <Typography
          variant="subtitle2"
          className="font-baloo"
          sx={{ marginLeft: 1 }}
        >
          {profileData.name}
        </Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'rgba(75, 85, 99, 0.3)', marginY: 1 }} />
      <Box sx={{ paddingTop: 1 }}>
        {children}
      </Box>
    </Drawer>
  );
};
