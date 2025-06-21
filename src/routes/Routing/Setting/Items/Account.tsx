import { motion } from 'framer-motion';
import { LanguageModal } from '@components';
import { ChevronLeft } from 'lucide-react';
import {
  Avatar,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useAccountAPI } from '@api';
import { PyrenzDialog } from '~/theme';
import { useState } from 'react';

export function Account() {
  const {
    languages,
    isModalOpen,
    user,
    toggleModal,
    handleLogOut,
    handleDeleteAccount,
    confirmDeleteAccount,
  } = useAccountAPI();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleOpenLogoutDialog = () => {
    setOpenLogoutDialog(true);
  };

  const handleCloseLogoutDialog = () => {
    setOpenLogoutDialog(false);
  };

  const handleConfirmLogout = () => {
    handleLogOut();
    setOpenLogoutDialog(false);
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
        <Typography
          variant="subtitle1"
          style={{ color: '#cbd5e0', marginTop: '0.5rem' }}
        >
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

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        bgcolor="rgba(255, 255, 255, 0.1)"
        borderRadius="0.5rem"
        maxWidth="md"
        width="100%"
      >
        <Typography variant="body1">Language</Typography>
        <motion.div whileHover={{ scaleX: -1 }} transition={{ duration: 0.3 }}>
          <Button
            onClick={toggleModal}
            style={{ color: '#fff', minWidth: 0 }}
            startIcon={<ChevronLeft className="chevron-icon" />}
            sx={{
              '&:hover .chevron-icon': {
                color: 'blue',
              },
              '& .chevron-icon[style*="transform: scaleX(-1)"]': {
                color: 'blue',
              },
            }}
          />
        </motion.div>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        bgcolor="rgba(255, 255, 255, 0.1)"
        borderRadius="0.5rem"
        maxWidth="md"
        width="100%"
      >
        <Typography variant="body1">Log Out</Typography>
        <motion.div whileHover={{ scaleX: -1 }} transition={{ duration: 0.3 }}>
          <Button
            onClick={handleOpenLogoutDialog}
            style={{ color: '#fff', minWidth: 0 }}
            startIcon={<ChevronLeft className="chevron-icon" />}
            sx={{
              '&:hover .chevron-icon': {
                color: 'blue',
              },
              '& .chevron-icon[style*="transform: scaleX(-1)"]': {
                color: 'blue',
              },
            }}
          />
        </motion.div>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        bgcolor="rgba(255, 255, 255, 0.1)"
        borderRadius="0.5rem"
        maxWidth="md"
        width="100%"
      >
        <Typography variant="body1">Delete Account</Typography>
        <motion.div whileHover={{ scaleX: -1 }} transition={{ duration: 0.3 }}>
          <Button
            onClick={handleOpenDeleteDialog}
            style={{ color: '#fff', minWidth: 0 }}
            startIcon={<ChevronLeft className="chevron-icon" />}
            sx={{
              '&:hover .chevron-icon': {
                color: 'blue',
              },
              '& .chevron-icon[style*="transform: scaleX(-1)"]': {
                color: 'blue',
              },
            }}
          />
        </motion.div>
      </Box>

      <PyrenzDialog
        open={openLogoutDialog}
        onClose={handleCloseLogoutDialog}
        title="Confirm Logout"
        content="Are you sure you want to log out?"
        onConfirm={handleConfirmLogout}
      />

      <PyrenzDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        title="Confirm Account Deletion"
        content="Are you sure you want to delete your account? This action cannot be undone."
        onConfirm={confirmDeleteAccount}
      />

      <LanguageModal
        languages={languages}
        isOpen={isModalOpen}
        onClose={toggleModal}
      />
    </motion.div>
  );
}
