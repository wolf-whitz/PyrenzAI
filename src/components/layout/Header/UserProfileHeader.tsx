import { useState } from 'react';
import { Box, Typography, Avatar, Skeleton, IconButton } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { usePyrenzAlert } from '~/provider';

interface UserProfileHeaderProps {
  loading: boolean;
  userData: {
    username: string;
    avatar_url: string;
    user_uuid: string;
  };
}

export function UserProfileHeader({ loading, userData }: UserProfileHeaderProps) {
  const showAlert = usePyrenzAlert();
  const [avatarError, setAvatarError] = useState(false);

  const handleCopyProfileUrl = () => {
    const profileUrl = `${window.location.origin}/Profile/${userData.user_uuid}`;
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => showAlert('Profile URL copied to clipboard!', 'Success'))
      .catch((err) => {
        console.error('Failed to copy URL: ', err);
        showAlert('Failed to copy URL', 'Alert');
      });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0]?.toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
      {loading ? (
        <Box display="flex" alignItems="center" mb={2}>
          <Skeleton variant="circular" width={60} height={60} sx={{ marginRight: 2 }} />
          <Skeleton variant="text" width={120} height={30} />
        </Box>
      ) : (
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            alt={userData.username}
            src={avatarError ? undefined : userData.avatar_url}
            sx={{ width: 60, height: 60, marginRight: 2 }}
            onError={() => setAvatarError(true)}
          >
            {!avatarError && !userData.avatar_url ? getInitials(userData.username) : null}
          </Avatar>
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
              ml: 1,
            }}
          >
            <LinkIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
