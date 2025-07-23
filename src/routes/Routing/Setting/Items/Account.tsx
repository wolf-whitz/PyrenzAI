import { motion } from 'framer-motion';
import { Avatar, Box, ButtonBase, Typography } from '@mui/material';
import { ChevronRightOutlined as ChevronRightIcon } from '@mui/icons-material';
import { LanguageModal, useAccountAPI } from '@components';
import { PyrenzDialog } from '~/theme';
import { useState } from 'react';

const MotionButtonBase = motion(ButtonBase);

const GlassyActionRow = ({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <MotionButtonBase
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        p: 3,
        borderRadius: '0.5rem',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        },
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: '#fff',
          transition: 'color 0.3s ease',
          '&:hover': {
            color: '#aee4ff',
          },
        }}
      >
        {label}
      </Typography>

      <motion.div
        animate={{ x: isHovered ? 6 : 0 }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <ChevronRightIcon
          sx={{
            color: '#fff',
            transition: 'color 0.3s ease',
            '.MuiButtonBase-root:hover &': {
              color: '#aee4ff',
            },
          }}
        />
      </motion.div>
    </MotionButtonBase>
  );
};

export function Account() {
  const {
    languages,
    isModalOpen,
    user,
    toggleModal,
    confirmLogOut,
    confirmDeleteAccount,
  } = useAccountAPI();
  const [dialogType, setDialogType] = useState<'logout' | 'delete' | null>(
    null
  );

  const handleConfirm = () => {
    if (dialogType === 'logout') confirmLogOut();
    else if (dialogType === 'delete') confirmDeleteAccount();
    setDialogType(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: 'white',
      }}
    >
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1">
          Account
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#cbd5e0', mt: 0.5 }}>
          Manage your login and account settings
        </Typography>
      </Box>

      {user && (
        <Box display="flex" alignItems="center" gap={2} mb={6}>
          <Avatar src={user.user_metadata?.avatar_url || ''} alt="Profile" />
          <Typography variant="body1">
            {user.user_metadata?.full_name || user.email}
          </Typography>
        </Box>
      )}

      <GlassyActionRow label="Language" onClick={toggleModal} />
      <GlassyActionRow
        label="Log Out"
        onClick={() => setDialogType('logout')}
      />
      <GlassyActionRow
        label="Delete Account"
        onClick={() => setDialogType('delete')}
      />

      <PyrenzDialog
        open={dialogType !== null}
        onClose={() => setDialogType(null)}
        title={
          dialogType === 'logout'
            ? 'Confirm Logout'
            : 'Confirm Account Deletion'
        }
        content={
          dialogType === 'logout'
            ? 'Are you sure you want to log out?'
            : 'Are you sure you want to delete your account? This action cannot be undone.'
        }
        onConfirm={handleConfirm}
      />

      <LanguageModal
        languages={languages}
        isOpen={isModalOpen}
        onClose={toggleModal}
      />
    </motion.div>
  );
}
