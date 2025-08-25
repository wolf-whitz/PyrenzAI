import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Switch,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Textarea, GetUserUUID } from '@components';
import { PyrenzBlueButton } from '~/theme';
import { Utils } from '~/utility';

type UserData = {
  jailbreak_prompt: string;
  is_jailbreak_enabled: boolean;
};

const PinkGlassSwitch = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 1,
    '&.Mui-checked': {
      transform: 'translateX(18px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: 'rgba(255, 105, 180, 0.3)',
        opacity: 1,
        border: '1px solid rgba(255,255,255,0.1)',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 22,
    height: 22,
    borderRadius: '50%',
    backgroundColor: '#ff69b4',
  },
  '& .MuiSwitch-track': {
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    opacity: 1,
  },
}));

const GlassDialog = styled(Dialog)({
  '& .MuiPaper-root': {
    backgroundColor: 'rgba(30, 30, 30, 0.6)',
    backdropFilter: 'blur(12px)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
});

const GlassButton = styled(Button)({
  padding: '6px 14px',
  borderRadius: 8,
  fontWeight: 500,
  fontSize: '0.875rem',
  color: '#fff',
  backgroundColor: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
});

export function Jailbreak() {
  const [user_uuid, setUserUUID] = useState('');
  const [jailbreakPrompt, setJailbreakPrompt] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchUUID = async () => {
      const uuid = await GetUserUUID();
      setUserUUID(uuid);
    };
    fetchUUID();
  }, []);

  useEffect(() => {
    if (!user_uuid) return;

    const fetchJailbreakData = async () => {
      const { data } = await Utils.db.select<UserData>({
        tables: 'user_data',
        columns: 'jailbreak_prompt, is_jailbreak_enabled',
        match: { user_uuid },
      });

      const userData = data?.[0];
      if (userData) {
        setJailbreakPrompt(userData.jailbreak_prompt || '');
        setIsEnabled(userData.is_jailbreak_enabled || false);
      }

      setLoading(false);
    };

    fetchJailbreakData();
  }, [user_uuid]);

  const handleSwitchToggle = () => {
    if (!isEnabled) setOpenDialog(true);
    else setIsEnabled(false);
  };

  const handleConfirm = () => {
    setIsEnabled(true);
    setOpenDialog(false);
  };

  const handleCancel = () => setOpenDialog(false);

  const handleSubmit = async () => {
    await Utils.db.update({
      tables: 'user_data',
      values: {
        jailbreak_prompt: jailbreakPrompt,
        is_jailbreak_enabled: isEnabled,
      },
      match: { user_uuid },
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Textarea
        label="Jailbreak Prompt"
        value={jailbreakPrompt}
        onChange={(e) => setJailbreakPrompt(e.target.value)}
      />

      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip title="Enable Jailbreak">
          <PinkGlassSwitch
            checked={isEnabled}
            onChange={handleSwitchToggle}
            aria-label="Enable Jailbreak"
          />
        </Tooltip>
        Enable Jailbreak
      </Box>

      <PyrenzBlueButton variant="contained" fullWidth onClick={handleSubmit}>
        Submit
      </PyrenzBlueButton>

      <GlassDialog open={openDialog} onClose={handleCancel}>
        <DialogTitle>Enable Jailbreak?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#ddd' }}>
            Enabling Jailbreak gives your AI fewer restrictions. This might
            break some filters or change behavior. Are you sure you want to
            enable it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <GlassButton onClick={handleCancel}>Cancel</GlassButton>
          <GlassButton onClick={handleConfirm} autoFocus>
            Confirm
          </GlassButton>
        </DialogActions>
      </GlassDialog>
    </Box>
  );
}
