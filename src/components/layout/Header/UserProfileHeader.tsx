import { useState } from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { usePyrenzAlert } from '~/provider';
import { User } from '@shared-types';

interface UserProfileHeaderProps {
  user: User;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  const showAlert = usePyrenzAlert();
  const [avatarError, setAvatarError] = useState(false);

  const handleCopyProfileUrl = () => {
    const profileUrl = `${window.location.origin}/Profile/${user.user_uuid}`;
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => showAlert('Profile URL copied to clipboard!', 'Success'))
      .catch((err) => {
        console.error('Failed to copy URL: ', err);
        showAlert('Failed to copy URL', 'Alert');
      });
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar
          alt={user.username}
          src={avatarError ? undefined : user.user_avatar}
          sx={{ width: 60, height: 60, marginRight: 2 }}
          onError={() => setAvatarError(true)}
        />
        <Typography variant="h6">{user.username}</Typography>
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
            ml: 1,
          }}
        >
          <LinkIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
