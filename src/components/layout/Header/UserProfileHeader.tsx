import { useState } from 'react';
import { Box, Avatar, IconButton, Chip } from '@mui/material';
import LinkIcon from '@mui/icons-material/LinkOutlined';
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

  const getPlanStyle = () => {
    switch (user.subscription_plan) {
      case 'Melon':
        return {
          label: '🍈 Melon',
          background: 'linear-gradient(135deg, #FFA726, #FFEB3B)',
          color: '#000',
        };
      case 'Durian':
        return {
          label: '🟤 Durian',
          background: '#8B4513',
          color: '#fff',
        };
      case 'Pineapple':
        return {
          label: '🍍 Pineapple',
          background: 'orange',
          color: '#000',
        };
      default:
        return null;
    }
  };

  const plan = getPlanStyle();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
      <Box display="flex" alignItems="center" mb={2} position="relative">
        <Avatar
          alt={user.username}
          src={avatarError ? undefined : user.user_avatar}
          sx={{ width: 60, height: 60, marginRight: 2 }}
          onError={() => setAvatarError(true)}
        />
        <Box display="flex" alignItems="center">
          <Box
            component="span"
            sx={{ fontSize: '1.25rem', fontWeight: 'medium', mr: 1 }}
          >
            {user.username}
          </Box>
          {plan && (
            <Chip
              label={plan.label}
              variant="outlined"
              color="default"
              size="small"
              sx={{
                background: plan.background,
                color: plan.color,
                fontWeight: 600,
                fontSize: '0.75rem',
                borderRadius: '8px',
                textTransform: 'uppercase',
                border: 0,
              }}
            />
          )}
        </Box>
        <IconButton
          onClick={handleCopyProfileUrl}
          aria-label="copy profile URL"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              borderColor: 'grey.700',
            },
            color: 'grey.500',
            transition: 'all 0.3s',
            ml: 1,
          }}
        >
          <LinkIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
