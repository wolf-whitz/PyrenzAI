import React from 'react';
import { Box, Typography, Avatar, Skeleton, IconButton } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import toast from 'react-hot-toast';

interface UserProfileHeaderProps {
  loading: boolean;
  userData: {
    username: string;
    avatar_url?: string;
    user_uuid: string;
  } | null;
}

export default function UserProfileHeader({ loading, userData }: UserProfileHeaderProps) {
  const handleCopyProfileUrl = () => {
    if (userData) {
      const profileUrl = `${window.location.origin}/Profile/${userData.user_uuid}`;
      navigator.clipboard.writeText(profileUrl).then(() => {
        toast.success('Profile URL copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy URL: ', err);
        toast.error('Failed to copy URL');
      });
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
      {loading ? (
        <Box display="flex" alignItems="center" mb={2}>
          <Skeleton
            variant="circular"
            width={60}
            height={60}
            sx={{ marginRight: 2 }}
          />
          <Skeleton variant="text" width={120} height={30} />
        </Box>
      ) : userData ? (
        <Box display="flex" alignItems="center" mb={2}>
          {userData.avatar_url && (
            <Avatar
              alt={userData.username}
              src={userData.avatar_url}
              sx={{ width: 60, height: 60, marginRight: 2 }}
            />
          )}
          <Typography variant="h6">{userData.username}</Typography>
          <IconButton
            onClick={handleCopyProfileUrl}
            aria-label="copy profile URL"
            sx={{
              '&:hover': {
                backgroundColor: 'transparent',
                color: 'grey',
              },
              color: 'inherit',
              transition: 'color 0.3s',
            }}
          >
            <LinkIcon />
          </IconButton>
        </Box>
      ) : null}
    </Box>
  );
}
