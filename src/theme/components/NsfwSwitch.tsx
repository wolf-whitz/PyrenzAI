import { useState } from 'react';
import { useUserStore } from '~/store';
import {
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Switch,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';

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

export function NSFWSwitch() {
  const { show_nsfw, toggleShowNSFW } = useUserStore();
  const [openTooltip, setOpenTooltip] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleTooltipOpen = () => setOpenTooltip(true);
  const handleTooltipClose = () => setOpenTooltip(false);

  const handleSwitchChange = () => {
    if (!show_nsfw) setOpenDialog(true);
    else {
      toggleShowNSFW();
      location.reload();
    }
  };

  const handleConfirm = () => {
    toggleShowNSFW();
    setOpenDialog(false);
    location.reload();
  };

  const handleCancel = () => setOpenDialog(false);

  return (
    <>
      <Tooltip
        title="NSFW Switch"
        arrow
        open={openTooltip}
        onOpen={handleTooltipOpen}
        onClose={handleTooltipClose}
      >
        <Box display="inline-flex">
          <PinkGlassSwitch
            checked={show_nsfw}
            onChange={handleSwitchChange}
            aria-label="NSFW switch"
            aria-checked={show_nsfw}
          />
        </Box>
      </Tooltip>

      <GlassDialog
        open={openDialog}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: '#ddd' }}
          >
            Enabling NSFW content confirms that you are 18 or older and that you
            agree to our Terms of Service. Pyrenzai does not guarantee the
            nature of user-generated content. If you encounter any characters or
            content that violate our rules, please report them. Are you sure you
            want to enable NSFW content?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <GlassButton onClick={handleCancel}>Cancel</GlassButton>
          <GlassButton onClick={handleConfirm} autoFocus>
            Confirm
          </GlassButton>
        </DialogActions>
      </GlassDialog>
    </>
  );
}
